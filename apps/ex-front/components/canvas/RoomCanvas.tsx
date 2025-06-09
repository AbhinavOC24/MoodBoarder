"use client";
//opens up websocket connection
import { WS_URL } from "@/config";
import { initDraw } from "@/draw/drawLogic";
import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNzk1MmIxNS05NDY3LTQwNjYtYTM3Yy1hMmQ3NDQzNzE5YjAiLCJpYXQiOjE3NDkxNTIyNDksImV4cCI6MTc0OTc1NzA0OX0.WNKJTi2bkm7aXpQIrmreXhvLXLyS2y1Gi4QLwL9Sd6Y`
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

export default RoomCanvas;
