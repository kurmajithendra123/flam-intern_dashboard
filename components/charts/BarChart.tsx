'use client';

import React, { useRef, useCallback } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

interface BarChartProps {
  data?: DataPoint[];
}

export default function BarChart({ data = [] }: BarChartProps) {
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

    // Aggregate by category
    const categories: Record<string, number[]> = {};
    chartData.forEach(point => {
      const cat = point.category || 'unknown';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(point.value);
    });

    const categoryData = Object.entries(categories).map(([category, values]) => ({
      category,
      value: values.reduce((a, b) => a + b, 0) / values.length
    }));

    if (categoryData.length === 0) return;

    const maxVal = Math.max(...categoryData.map(d => d.value));
    const barWidth = (width - padding * 2) / categoryData.length * 0.8;
    const gap = (width - padding * 2) / categoryData.length * 0.2;

    // Draw bars
    categoryData.forEach((cat, i) => {
      const x = padding + i * (barWidth + gap);
      const barHeight = ((cat.value / maxVal) * (height - padding * 2));
      const y = height - padding - barHeight;

      ctx.fillStyle = `hsl(${i * 60}, 70%, 50%)`;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Category label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '12px sans-serif';
      ctx.fillText(cat.category, x + barWidth / 2 - 10, height - padding + 15);

      // Value label
      ctx.fillText(cat.value.toFixed(1), x + barWidth / 2 - 10, y - 5);
    });

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Max value label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(maxVal.toFixed(2), 5, padding + 10);
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
