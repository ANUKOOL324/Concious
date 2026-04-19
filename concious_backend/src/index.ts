import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import z from "zod";
import cors from "cors";
import { JWT_PASSWORD, PORT } from "./config.js";
import { auth } from "./middleware.js";
import { connectDB, UserModel, ContentModel, LinkModel } from "./db.js";
import { random } from "./utils.js";
import { askOpenRouter, getHfEmbedding } from "./providers.js";

const app = express();
app.use(express.json());
app.use(cors());

type SearchItem = {
  _id?: string;
  title?: string | null;
  link?: string | null;
  type?: string | null;
  similarity?: number;
};

function buildContentText(input: {
  title?: string | null;
  link?: string | null;
  type?: string | null;
}) {
  return [input.type, input.title, input.link].filter(Boolean).join("\n");
}

async function lexicalSearch(userId: string, query: string, limit: number) {
  const regex = new RegExp(query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

  const results = await ContentModel.find({
    userId,
    $or: [{ title: regex }, { link: regex }, { type: regex }],
  })
    .sort({ _id: -1 })
    .limit(limit)
    .lean();

  return results.map((item, index): SearchItem => {
    const title = item.title ?? null;
    const link = item.link ?? null;
    const type = item.type ?? null;

    let similarity = 0.72;

    if (title && regex.test(title)) {
      similarity = 0.99;
    } else if (link && regex.test(link)) {
      similarity = 0.92;
    } else if (type && regex.test(type)) {
      similarity = 0.86;
    }

    similarity = Math.max(0.6, similarity - index * 0.02);

    return {
      _id: String(item._id),
      title,
      link,
      type,
      similarity,
    };
  });
}

function mergeSearchResults(vectorResults: SearchItem[], lexicalResults: SearchItem[], limit: number) {
  const merged = new Map<string, SearchItem>();
  const getKey = (item: SearchItem) => {
    const normalizedLink = item.link?.trim().toLowerCase();
    const normalizedTitle = item.title?.trim().toLowerCase();
    return normalizedLink || normalizedTitle || (item._id ? String(item._id) : `fallback-${Math.random()}`);
  };

  for (const item of vectorResults) {
    const key = getKey(item);
    merged.set(key, item);
  }

  for (const item of lexicalResults) {
    const key = getKey(item);
    const current = merged.get(key);

    if (!current) {
      merged.set(key, item);
      continue;
    }

    merged.set(key, {
      ...current,
      similarity: Math.max(current.similarity ?? 0, item.similarity ?? 0),
    });
  }

  return [...merged.values()]
    .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
    .slice(0, limit);
}

app.post("/api/v1/signup", async (req, res) => {
  const requireBody = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(10, { message: "Username must not exceed 10 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(20, { message: "Password must not exceed 20 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
  });

  const parsedData = requireBody.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "incorrect format",
      error: parsedData.error,
    });
  }

  const { username, password } = parsedData.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 2);

    await UserModel.create({
      username,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "you are signed up !",
    });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "invalid user data",
      });
    }

    if (e && typeof e === "object" && "code" in e && e.code === 11000) {
      return res.status(409).json({
        message: "user already exist",
      });
    }

    console.error("signup failed", e);
    return res.status(500).json({
      message: "failed to create user",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({
    username,
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (typeof user.password !== "string") {
    return res.status(500).json({ message: "Invalid user record" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    JWT_PASSWORD
  );

  return res.json({
    token,
  });
});

app.post("/api/v1/content", auth, async (req, res) => {
  try {
    const { title, link, type } = req.body;
    const embedding = await getHfEmbedding(buildContentText({ title, link, type }), "document");
    const createInput: any = {
      title,
      link,
      type,
      tags: [],
      userId: req.userId,
    };

    if (embedding) {
      createInput.embedding = embedding;
    }

    await ContentModel.create(createInput);

    return res.json({
      message: "content is added !",
      mode: embedding ? "vector" : "lexical-fallback",
    });
  } catch (error) {
    console.error("content create failed", error);
    return res.status(500).json({
      message: "failed to add content",
    });
  }
});

app.get("/api/v1/content", auth, async (req, res) => {
  const content = await ContentModel.find({
    userId: req.userId,
  }).populate("userId", "username");

  return res.json({
    content,
  });
});

app.patch("/api/v1/content/:id", auth, async (req, res) => {
  const contentId = req.params.id;
  const { title } = req.body;

  const existingContent = await ContentModel.findOne({
    _id: contentId,
    userId: req.userId,
  });

  if (!existingContent) {
    return res.status(404).json({
      message: "Content not found or unauthorized",
    });
  }

  existingContent.title = title;
  const refreshedEmbedding = await getHfEmbedding(
    buildContentText({
      title,
      link: existingContent.link ?? null,
      type: existingContent.type ?? null,
    }),
    "document"
  );

  if (refreshedEmbedding) {
    existingContent.embedding = refreshedEmbedding;
  }

  await existingContent.save();

  return res.json(existingContent);
});

app.delete("/api/v1/content/:id", auth, async (req, res) => {
  await ContentModel.deleteMany({
    _id: req.params.id,
    userId: req.userId,
  });

  return res.json({
    message: "content is delete",
  });
});

app.post("/api/v1/search", auth, async (req, res) => {
  const query = String(req.body.query ?? "").trim();
  const limit = Math.min(Math.max(Number(req.body.limit ?? 6), 1), 10);
  const lexicalResults = await lexicalSearch(String(req.userId), query, limit);

  if (!query) {
    return res.json({
      query,
      count: 0,
      mode: "lexical-fallback",
      results: [],
    });
  }

  const queryVector = await getHfEmbedding(query, "query");

  if (!queryVector) {
    return res.json({
      query,
      count: lexicalResults.length,
      mode: "lexical-fallback",
      results: lexicalResults,
    });
  }

  try {
    const userId = new mongoose.Types.ObjectId(String(req.userId));

    const results = await ContentModel.aggregate([
      {
        $vectorSearch: {
          index: "vector_idx",
          path: "embedding",
          queryVector,
          numCandidates: 50,
          limit,
        },
      },
      {
        $match: {
          userId,
        },
      },
      {
        $project: {
          title: 1,
          link: 1,
          type: 1,
          similarity: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    const mergedResults = mergeSearchResults(results, lexicalResults, limit);

    return res.json({
      query,
      count: mergedResults.length,
      mode: "vector",
      results: mergedResults,
    });
  } catch (error) {
    console.error("vector search failed", error);

    return res.json({
      query,
      count: lexicalResults.length,
      mode: "lexical-fallback",
      results: lexicalResults,
    });
  }
});

app.post("/api/v1/chat", auth, async (req, res) => {
  const message = String(req.body.message ?? "").trim();

  if (!message) {
    return res.status(400).json({
      message: "Message is required",
    });
  }

  const queryVector = await getHfEmbedding(message, "query");
  let mode: "vector" | "lexical-fallback" = "lexical-fallback";
  let sources: SearchItem[] = [];

  if (queryVector) {
    try {
      const userId = new mongoose.Types.ObjectId(String(req.userId));

      const vectorSources = await ContentModel.aggregate([
        {
          $vectorSearch: {
            index: "vector_idx",
            path: "embedding",
            queryVector,
            numCandidates: 50,
            limit: 4,
          },
        },
        {
          $match: {
            userId,
          },
        },
        {
          $project: {
            title: 1,
            link: 1,
            type: 1,
            similarity: { $meta: "vectorSearchScore" },
          },
        },
      ]);

      sources = vectorSources.map(
        (item): SearchItem => ({
          title: item.title ?? null,
          link: item.link ?? null,
          type: item.type ?? null,
          similarity: item.similarity,
        })
      );
      mode = "vector";
    } catch (error) {
      console.error("chat vector retrieval failed", error);
    }
  }

  if (!sources.length) {
    sources = await lexicalSearch(String(req.userId), message, 4);
    mode = "lexical-fallback";
  }

  const context = sources.length
    ? sources
        .map((source, index) => {
          const title = source.title?.trim() || `Saved item ${index + 1}`;
          const type = source.type || "content";
          const link = source.link || "no external link";
          return `- ${title} (${type}) -> ${link}`;
        })
        .join("\n")
    : "No saved content matched strongly.";

  const llmResponse = await askOpenRouter(message, context);

  return res.json({
    mode,
    response:
      llmResponse ??
      (sources.length
        ? `I found ${sources.length} relevant saved item${sources.length > 1 ? "s" : ""}. The strongest match is ${sources[0]?.title || "an untitled item"}. What angle would you like to explore next?`
        : "I couldn't find a strong match yet, but we can still refine the question together. What part should I search more specifically?"),
    sources,
  });
});

app.post("/api/v1/reindex-embeddings", auth, async (req, res) => {
  const docs = await ContentModel.find({
    userId: req.userId,
  });

  let updated = 0;

  for (const doc of docs) {
    const embedding = await getHfEmbedding(
      buildContentText({
        title: doc.title ?? null,
        link: doc.link ?? null,
        type: doc.type ?? null,
      }),
      "document"
    );

    if (embedding) {
      doc.embedding = embedding;
      await doc.save();
      updated += 1;
    }
  }

  return res.json({
    message: "Embeddings refreshed",
    updated,
  });
});

app.post("/api/v1/brain/share", auth, async (req, res) => {
  const status = req.body.status;
  if (status) {
    const existLink = await LinkModel.findOne({
      userId: req.userId,
    });

    if (existLink) {
      return res.json({
        hash: existLink.hash,
      });
    }

    const hash = random(10);

    await LinkModel.create({
      hash,
      userId: req.userId,
    });

    return res.json({
      hash,
    });
  }

  await LinkModel.deleteOne({
    userId: req.userId,
  });

  return res.json({
    message: "Removed link",
  });
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({
    hash,
  });

  if (!link) {
    return res.json({
      message: "it is not correct link !",
    });
  }

  const content = await ContentModel.find({
    userId: link.userId,
  });

  const user = await UserModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    return res.json({
      message: "user not found, rare error !",
    });
  }

  return res.json({
    username: user.username,
    content,
  });
});

async function startServer() {
  try {
    await connectDB();
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
