import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import checkAuth from "./middleware/checkAuth";
import { createUserSchema, signInSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { jwtSecret, NODE_ENV } from "@repo/backend-common/config";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.post("/signup", async (req: Request, res: Response) => {
  const userInfo = createUserSchema.safeParse(req.body);
  if (!userInfo.success) {
    res.status(400).json({
      message: "Incorrect data",
    });
    return;
  }

  if (!jwtSecret) {
    res.status(500).json({
      message: "JWT secret is not defined",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(userInfo.data.password, 10);
  const userInfoFromDb = await prismaClient.user.create({
    data: {
      username: userInfo.data.username,
      password: hashedPassword,
      email: userInfo.data.email,
      photo: userInfo.data.photo || "https://robohash.org/default-avatar",
    },
    select: {
      id: true,
    },
  });
  const userId = userInfoFromDb.id;
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
  });
  res.status(201).json({
    message: "Signup successful",
  });
});

app.post("/login", async (req: Request, res: Response) => {
  const userInfo = signInSchema.safeParse(req.body);
  if (!userInfo.success) {
    res.status(400).json({
      message: "Incorrect credentials",
    });
    return;
  }
  const userInfoFromDb = await prismaClient.user.findUnique({
    where: {
      email: userInfo.data.email,
    },
  });

  if (!userInfoFromDb) {
    res.status(404).json({
      message: "Incorrect credentials",
    });
    return;
  }
  const checkPass = await bcrypt.compare(
    userInfo.data.password,
    userInfoFromDb.password
  );
  if (!checkPass) {
    res.status(401).json({
      message: "Incorrect credentials",
    });
    return;
  }

  const userId = userInfoFromDb.id;
  const token = jwt.sign({ userId }, jwtSecret as string, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: NODE_ENV === "production",
  });
  res.status(200).json({
    message: "Login successful",
  });
});

app.post("/create-room", checkAuth, (req: Request, res: Response) => {
  // Add your implementation here
  res.status(201).json({
    message: "Room created successfully",
  });
});
