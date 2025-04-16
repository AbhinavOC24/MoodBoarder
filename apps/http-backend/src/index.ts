import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "@repo/backend-common/config";
import cookieParser from "cookie-parser";
import checkAuth from "./middleware/checkAuth";
import { createUserSchema, signInSchema } from "@repo/common/types";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.post("/signup", (req: Request, res: Response) => {
  const data = createUserSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({
      message: "Incorrect data",
    });
    return;
  }

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({
      message: "Missing required fields",
    });
    return;
  }
  if (!jwtSecret) {
    res.status(500).json({
      message: "JWT secret is not defined",
    });
    return;
  }
  const userId = "12345";
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "7d",
  });
  res.cookie("token", token);
  res.json({
    message: "Signup successfull",
    username: username,
    email,
    password,
  });
});

app.post("/login", (req: Request, res: Response) => {
  const data = signInSchema.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({
      message: "Incorrect credentials",
    });
    return;
  }
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      message: "Missing required fields",
    });
    return;
  }

  const userId = "12345";
  const newToken = jwt.sign({ userId }, jwtSecret as string, {
    expiresIn: "7d",
  });

  res.cookie("token", newToken);
  res.json({ message: "Signin successful", username, password });
});

app.post("/create-room", checkAuth, (req: Request, res: Response) => {});
