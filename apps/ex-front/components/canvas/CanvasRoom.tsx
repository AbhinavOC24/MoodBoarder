"use client";
//opens up websocket connection
import { WS_URL } from "@/config";

import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";
import axios from "axios";

export default function CanvasRoom({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNzk1MmIxNS05NDY3LTQwNjYtYTM3Yy1hMmQ3NDQzNzE5YjAiLCJpYXQiOjE3NTEzNDQ0NTcsImV4cCI6MTc1MTk0OTI1N30.2R_77vw1AelewpxmFWe5Doa0Hx6XYbik9yl6OxTfhvI

  `
    );
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };
  }, []);

  // useEffect(() => {
  //   if (!roomId) return;

  //   async function startConnection() {
  //     // Fetch a short-lived WS token
  //     const res = await axios.get("http://localhost:3001/api/ws-token", {
  //       withCredentials: true,
  //     });

  //     const { wsToken } = await res.data;

  //     // Connect to WS
  //     const ws = new WebSocket(`${WS_URL}?token=${wsToken}`);
  //     ws.onopen = () => {
  //       console.log("WS connected");
  //       setSocket(ws);

  //       ws.send(
  //         JSON.stringify({
  //           type: "join_room",
  //           roomId,
  //         })
  //       );
  //     };

  //     ws.onclose = () => {
  //       console.log("WS disconnected");
  //       setSocket(null);
  //     };
  //   }

  //   startConnection();
  // }, [roomId]);

  if (!socket) return <div>Connecting to server...</div>;
  return (
    <>
      <div style={{ margin: 0, padding: 0 }}>
        <Canvas roomId={roomId} socket={socket} />
      </div>
    </>
  );
}
