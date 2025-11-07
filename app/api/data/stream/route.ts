import { generateDataPoints } from '@/lib/dataGenerator'

export const runtime = 'edge'

export async function GET(req: Request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      const write = (data: any) => {
        const payload = JSON.stringify({ data })
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`))
      }

      // emit first immediately
      write(generateDataPoints())

      const id = setInterval(() => {
        if (closed) return
        try {
          write(generateDataPoints())
        } catch (e) {
          // ignore
        }
      }, 100)

      // stop when client disconnects
      try {
        req.signal.addEventListener('abort', () => {
          closed = true
          clearInterval(id)
          try { controller.close() } catch {}
        })
      } catch (_) {
        // some runtimes may not support req.signal
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    }
  })
}
