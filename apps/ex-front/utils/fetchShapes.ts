import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export async function getExistingShape(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);

  const message = res.data;

  const shapes = message.map((message: any) => {
    const messageData = JSON.parse(message.message);
    return messageData.shape;
  });
  return shapes;
}
