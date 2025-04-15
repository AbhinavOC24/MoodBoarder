import express from "express";
import { Request, Response } from "express";
const app = express();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import checkAuth from "./middleware/checkAuth";

dotenv.config();
app.use(express.json());
app.use(cookieParser());

const jwtSecret = process.env.JWT_SECRET || null;

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.post("/signup", (req: Request, res: Response) => {
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
  const token = jwt.sign({ userId }, jwtSecret as string, {
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

app.get("/login", (req: Request, res: Response) => {
  res.json({ message: "Please use POST method for login" });
});

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const token = req.cookies.token;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      res.json({ message: "You are already logged in" });
      res.redirect("/");
      return;
    } catch (e) {
      console.log("Invalid Token from signin route and error:", e);
    }
  }
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
