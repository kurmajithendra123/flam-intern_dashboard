export function clearCanvas(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h)
}

export function drawAxes(ctx: CanvasRenderingContext2D, w: number, h: number, padding = 40) {
  ctx.save()
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.beginPath()
  // y axis
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, h - padding)
  // x axis
  ctx.lineTo(w - padding, h - padding)
  ctx.stroke()
  ctx.restore()
}

export function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.save()
  ctx.fillStyle = '#6b7280'
  ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
  ctx.restore()
}

export function resizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  const rect = canvas.getBoundingClientRect()
  const w = Math.max(1, Math.round(rect.width))
  const h = Math.max(1, Math.round(rect.height))
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  return { width: w, height: h, dpr }
}
// named export compatibility
 
