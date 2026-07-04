import mongoose, { model, Schema } from "mongoose";
import { MONGO_URI } from "./config.js";

export async function connectDB() {
  await mongoose.connect(MONGO_URI);
}

// 1. User Schema (with timestamps)
const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model("user", UserSchema);

// 2. Content Schema (with indexing status, optional extraction fields, and timestamps)
const ContentSchema = new Schema(
  {
    title: { type: String, required: true },
    link: { type: String },
    type: { type: String, required: true, lowercase: true, trim: true },
    tags: { type: [String], default: [] },
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true, index: true },
    embedding: { type: [Number], default: undefined },
    description: { type: String },
    extractedText: { type: String },
    summary: { type: String },
    personalNote: { type: String },
    collection: { type: String },
    whySaved: { type: String },
    importance: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    indexingStatus: {
      type: String,
      enum: ["not_indexed", "pending", "indexed", "failed"],
      default: "not_indexed",
    },
    indexingError: { type: String },
    lastIndexedAt: { type: Date },
  },
  { timestamps: true }
);

// Explicit indexing for userId queries
ContentSchema.index({ userId: 1 });

export const ContentModel = model("content", ContentSchema);

// 3. Content Chunk Schema (for granular RAG queries)
const ContentChunkSchema = new Schema(
  {
    contentId: {
      type: mongoose.Types.ObjectId,
      ref: "content",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    title: String,
    link: String,
    type: String,
    chunkText: {
      type: String,
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
    source: {
      type: String,
      default: "metadata",
    },
    charLength: Number,
  },
  { timestamps: true }
);

ContentChunkSchema.index({ userId: 1 });
ContentChunkSchema.index({ contentId: 1 });
ContentChunkSchema.index({ userId: 1, contentId: 1 });

export const ContentChunkModel = model("contentchunk", ContentChunkSchema);

// 4. Link Schema (with timestamps, unique hash index)
const LinkSchema = new Schema(
  {
    hash: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Types.ObjectId, ref: "user", required: true, index: true },
  },
  { timestamps: true }
);

export const LinkModel = model("link", LinkSchema);
