export function initDraw(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let start = false;
  let startX = 0;
  let startY = 0;
  canvas.addEventListener("mousedown", (e) => {
    start = true;
    startX = e.clientX;
    startY = e.clientY;
    console.log(e.clientX);
    console.log(e.clientY);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (start) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      console.log(e.clientX);
      console.log(e.clientY);
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgb(255,255,255)";
      ctx?.strokeRect(startX, startY, width, height);
    }
  });
  canvas.addEventListener("mouseup", (e) => {
    start = false;
    console.log(e.clientX);
    console.log(e.clientY);
  });
}
