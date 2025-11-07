'use client';

import React, { useRef, useCallback } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

interface LineChartProps {
  data?: DataPoint[];
}

export default function LineChart({ data = [] }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderChart = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    chartData: DataPoint[]
  ) => {
    const { width, height } = canvas.getBoundingClientRect();
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (chartData.length < 2) return;

    // Get values
    const values = chartData.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    // Draw line
    ctx.strokeStyle = '#32a0cd';
    ctx.lineWidth = 2;
    ctx.beginPath();

    chartData.forEach((point, i) => {
      const x = padding + (i / (chartData.length - 1)) * (width - padding * 2);
      const y = padding + (height - padding * 2) - ((point.value - minVal) / range) * (height - padding * 2);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px sans-serif';
    ctx.fillText(`pts: ${chartData.length}`, padding, padding - 10);
    ctx.fillText(maxVal.toFixed(2), 5, padding + 10);
    ctx.fillText(minVal.toFixed(2), 5, height - padding - 5);
  }, []);

  useChartRenderer(canvasRef, data, renderChart);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[300px] rounded-lg"
      style={{ background: 'rgba(255, 255, 255, 0.02)' }}
    />
  );
}
