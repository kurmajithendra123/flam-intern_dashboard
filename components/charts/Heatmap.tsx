'use client';

import React, { useRef, useCallback } from 'react';
import { DataPoint } from '@/lib/types';
import { useChartRenderer } from '@/hooks/useChartRenderer';

interface HeatmapProps {
  data?: DataPoint[];
}

export default function Heatmap({ data = [] }: HeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderChart = useCallback((
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    chartData: DataPoint[]
  ) => {
    const { width, height } = canvas.getBoundingClientRect();
    const gridSize = 20;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    ctx.clearRect(0, 0, width, height);

    if (chartData.length === 0) return;

    // Create grid
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));

    // Fill grid with data
    chartData.forEach(point => {
      const xi = Math.floor(((point.x || 0) / 100) * (gridSize - 1));
      const yi = Math.floor(((point.y || 0) / 100) * (gridSize - 1));
      if (xi >= 0 && xi < gridSize && yi >= 0 && yi < gridSize) {
        grid[yi][xi]++;
      }
    });

    const maxCount = Math.max(...grid.flat(), 1);

    // Draw heatmap
    for (let yi = 0; yi < gridSize; yi++) {
      for (let xi = 0; xi < gridSize; xi++) {
        const count = grid[yi][xi];
        const intensity = count / maxCount;
        ctx.fillStyle = `rgba(50, 160, 205, ${intensity})`;
        ctx.fillRect(xi * cellWidth, yi * cellHeight, cellWidth, cellHeight);
      }
    }
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
