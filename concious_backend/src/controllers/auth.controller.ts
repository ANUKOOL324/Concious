import type { Request, Response } from "express";
import {
  mapSignupError,
  signinUser,
  signupUser,
  validateSignupBody,
} from "../services/auth.service.js";

export async function signup(req: Request, res: Response) {
  const parsedData = validateSignupBody(req.body);

  if (!parsedData.success) {
    return res.status(400).json({
      message: "Please check your signup details.",
      issues: parsedData.error.issues.map((issue) => issue.message),
    });
  }

  const { username, password } = parsedData.data;

  try {
    await signupUser(username, password);
    return res.status(201).json({ message: "you are signed up !" });
  } catch (e) {
    const mapped = mapSignupError(e);
    return res.status(mapped.status).json({ message: mapped.message });
  }
}

export async function signin(req: Request, res: Response) {
  const { username, password } = req.body;
  const result = await signinUser(username, password);

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message });
  }

  return res.json({ token: result.token });
}
