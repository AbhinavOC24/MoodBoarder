"use client";
//opens up websocket connection
import { WS_URL } from "@/config";

import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

export default function CanvasRoom({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNzk1MmIxNS05NDY3LTQwNjYtYTM3Yy1hMmQ3NDQzNzE5YjAiLCJpYXQiOjE3NTA1ODgwNDEsImV4cCI6MTc1MTE5Mjg0MX0.udem2D_FyYv8f4ERO50qvvPgKp4ECO7QcpH_hMNAoN0

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
  if (!socket) return <div>Connecting to server...</div>;
  return (
    <>
      <div style={{ margin: 0, padding: 0 }}>
        <Canvas roomId={roomId} socket={socket} />
      </div>
    </>
  );
}
