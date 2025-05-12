"use client";
//opens up websocket connection
import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiYzg1MGZkNC1jNmU4LTQ0MTQtOGI0NC0xZmU2M2U4OGE5MTIiLCJpYXQiOjE3NDY3NTE2MzksImV4cCI6MTc0NzM1NjQzOX0.5rmR-6Ynac8Zhi9KAjSsMaW3JqQ8ka_I9EpxacM_YpE`
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
