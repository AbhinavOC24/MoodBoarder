import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const signInSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(100),
});

export const createRoomSchema = z.object({
  name: z.string().min(3).max(20),
});
