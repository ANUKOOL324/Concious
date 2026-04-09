import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import z from "zod";
import { JWT_PASSWORD, PORT } from "./config.js";
import { auth } from "./middleware.js";
import { UserModel, ContentModel, LinkModel } from "./db.js"; //You still keep src/db.ts as a TypeScript file. TypeScript understands that ./db.js refers to ./db.ts at build time and will emit dist/index.js with import { UserModel } from './db.js'; — which Node can load
import { random } from "./utils.js";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

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
    res.json({
      message: "incorrect format",
      error: parsedData.error,
    });
    return;
  }

  const username = req.body.username;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 2);

    await UserModel.create({
      username: username,
      password: hashedPassword,
    });

    res.status(200).json({
      message: "you are signed up !",
    });
  } catch (e) {
    res.json({
      message: "user already exist",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await UserModel.findOne({
    username,
  });
  //@ts-ignore
  const valid = await bcrypt.compare(password,user.password  );

  if (!valid) {
    return res.json({message:"Invalid credentials"});
  }
  //console.log(user)
  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_PASSWORD
    );

     res.json({
      token,
    });
  } else {
     res.json({
      message: "wrong credentials",
    });
  }
});

app.post("/api/v1/content", auth, async (req, res) => {
  const title = req.body.title;
  const link = req.body.link;
  const type = req.body.type;

  await ContentModel.create({
    title,
    link,
    type,
    tags: [],
    userId: req.userId,
  });
  return res.json({
    message: "content is added !",
  });
});

app.get("/api/v1/content", auth, async (req, res) => {
  const userId = req.userId;

  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");

  return res.json({
    content,
  });
});

app.delete("/api/v1/content/:id", auth, async (req, res) => {
  const contentId = req.params.id;

  await ContentModel.deleteMany({
    _id: contentId,
    userId: req.userId,
  });

  return res.json({
    message: "content is delete",
  });
});

app.post("/api/v1/brain/share", auth, async (req, res) => {
  const status = req.body.status;
  if (status) {
    const existLink = await LinkModel.findOne({
      userId: req.userId,
    });

    if (existLink) {
      //console.log("i am here")
      return res.json({
        hash: existLink.hash,
      });
    }

    const hash = random(10);

    await LinkModel.create({
      hash: hash,
      userId: req.userId,
    });

    return res.json({
      hash,
    });
  } else {
    await LinkModel.deleteOne({
      userId: req.userId,
    });

    return res.json({
      message: "Removed link",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({
    hash,
  });

  if (!link) {
    res.json({
      message: "it is not correct link !",
    });
    return;
  }

  const content = await ContentModel.find({
    userId: link.userId,
  });

  const user = await UserModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    res.json({
      message: "user not found, rare error !",
    });
    return;
  }

  res.json({
    username: user.username,
    content: content,
  });
});

app.patch("/api/v1/content/:id", auth, async (req, res) => {
  const contentId = req.params.id;
  const { title } = req.body;

  const updatedContent = await ContentModel.findOneAndUpdate(
    {
      _id: contentId,
      userId: req.userId,
    },
    {
      title,
    },
    {
      new: true,
    }
  );

  if (!updatedContent) {
    return res.status(404).json({
      message: "Content not found or unauthorized",
    });
  }

  res.json(updatedContent);
});

app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
