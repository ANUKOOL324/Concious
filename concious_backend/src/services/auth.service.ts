import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import z from "zod";
import { JWT_PASSWORD } from "../config.js";
import { UserModel } from "../db.js";

const signupSchema = z.object({
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

export function validateSignupBody(body: unknown) {
  return signupSchema.safeParse(body);
}

export async function signupUser(username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await UserModel.create({ username, password: hashedPassword });
}

export function mapSignupError(e: unknown) {
  if (e instanceof mongoose.Error.ValidationError) {
    return { status: 400, message: "invalid user data" };
  }
  if (e && typeof e === "object" && "code" in e && e.code === 11000) {
    return { status: 409, message: "This username is already taken. Try another one." };
  }
  console.error("signup failed", e);
  return { status: 500, message: "Something went wrong. Please try again in a moment." };
}

export async function signinUser(username: string, password: string) {
  const user = await UserModel.findOne({ username });

  if (!user || typeof user.password !== "string") {
    return { ok: false as const, status: 401, message: "Invalid username or password." };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return { ok: false as const, status: 401, message: "Invalid username or password." };
  }

  const token = jwt.sign({ id: user._id }, JWT_PASSWORD);
  return { ok: true as const, token };
}
