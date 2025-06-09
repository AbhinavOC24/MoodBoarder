import RoomCanvas from "@/components/canvas/RoomCanvas";

async function canvasPage({ params }: { params: { roomId: string } }) {
  const roomId = (await params).roomId;
  return <RoomCanvas roomId={roomId} />;
}
export default canvasPage;
