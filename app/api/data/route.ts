import { NextResponse } from 'next/server'
import { generateDataPoints } from '@/lib/dataGenerator'
import type { DataPoint } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const countParam = url.searchParams.get('count')
    const count = Number(countParam ?? '1000')
    const safeCount = Number.isFinite(count) && count > 0 ? Math.min(100000, Math.floor(count)) : 1000

    const data: DataPoint[] = generateDataPoints(safeCount)

    return NextResponse.json({
      success: true,
      data,
      timestamp: Date.now(),
      count: data.length
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
