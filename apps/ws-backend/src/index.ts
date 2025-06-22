import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import prismaClient from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });
import { jwtSecret } from "@repo/backend-common/config";

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (typeof decoded == "string") return null;

    if (!decoded || !decoded.userId) return null;

    return decoded.userId;
  } catch (e) {
    console.log(e);
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  try {
    console.log("new connection");

    const url = request.url;
    if (!url) {
      return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const userId = checkUser(token);

    if (!userId) {
      ws.close();
      return;
    }

    users.push({
      ws,
      userId,
      rooms: [],
    });
    console.log("verified");
    ws.on("message", async function message(data) {
      const parsedData = JSON.parse(data as unknown as string); //{type:"join room",roomId:1}

      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
      }

      if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (!user) return;
        user.rooms = user?.rooms.filter((x) => x != parsedData.roomId);
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message;
        const shapeId = JSON.parse(message).shape.shapeId;
        const theUser = users.find((x) => x.ws === ws);

        if (theUser?.rooms.includes(roomId)) {
          await prismaClient.chat.create({
            data: {
              message,
              room: {
                connect: {
                  id: Number(roomId),
                },
              },
              user: {
                connect: {
                  id: userId,
                },
              },
              shapeId,
            },
          });
          users.forEach((user) => {
            if (user.ws != ws) {
              if (user.rooms.includes(roomId)) {
                user.ws.send(
                  JSON.stringify({ type: "chat", message: message, roomId })
                );
              }
            }
          });
        }
      }
      if (parsedData.type === "deleted") {
        const roomId = parsedData.roomId;

        const { deletedShape } = JSON.parse(parsedData.message);
        console.log("deletedShape", deletedShape);
        const shapeIdsToDelete = deletedShape.map(
          (shape: any) => shape.shapeId
        );

        await prismaClient.chat.deleteMany({
          where: {
            shapeId: {
              in: shapeIdsToDelete,
            },
          },
        });
        console.log("shapeIdsToDelete", shapeIdsToDelete);
        users.forEach((user) => {
          if (user.ws != ws && user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "deleted",
                message: shapeIdsToDelete,
                roomId,
              })
            );
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
});
