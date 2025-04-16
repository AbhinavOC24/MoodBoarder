import { WebSocketServer } from "ws";
import jwt, { JwtPayload, verify } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });
import { jwtSecret } from "@repo/backend-common/config";

wss.on("connection", function connection(ws, request) {
  console.log("new connection ");

  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const decoded = verify(token, jwtSecret);
  if (!decoded || !(decoded as JwtPayload).userId) {
    ws.close();
    return;
  }

  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
