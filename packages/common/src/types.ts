import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  photo: z.string().url().optional(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const createRoomSchema = z.object({
  slug: z.string().min(3).max(20),
});
