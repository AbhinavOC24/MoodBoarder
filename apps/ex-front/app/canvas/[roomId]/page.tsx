import CanvasRoom from "@/components/canvas/CanvasRoom";

async function canvasPage({ params }: { params: { roomId: string } }) {
  const roomId = (await params).roomId;
  return <CanvasRoom roomId={roomId} />;
}
export default canvasPage;
