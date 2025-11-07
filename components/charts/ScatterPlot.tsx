'use client';

import React, { useRef, useCallback } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

interface ScatterPlotProps {
  data?: DataPoint[];
}

export default function ScatterPlot({ data = [] }: ScatterPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderChart = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    chartData: DataPoint[]
  ) => {
    const { width, height } = canvas.getBoundingClientRect();
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    if (chartData.length === 0) return;

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw points
    chartData.forEach(point => {
      const x = padding + ((point.x || 0) / 100) * (width - padding * 2);
      const y = padding + (1 - (point.y || 0) / 100) * (height - padding * 2);

      ctx.fillStyle = point.status === 'warn' || point.status === 'warning' 
        ? '#f59e0b' 
        : '#10b981';
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Point count label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px sans-serif';
    ctx.fillText(`pts: ${chartData.length}`, padding, padding - 10);
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
