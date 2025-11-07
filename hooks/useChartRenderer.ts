'use client';

import { useEffect, useRef, useCallback } from 'react';
import { resizeCanvas } from '@/lib/canvasUtils';

export function useChartRenderer<T>(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  data: T[],
  renderChart: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: T[]) => void
) {
  const animationFrameRef = useRef<number>();

  const doRender = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    resizeCanvas(canvas);
    
    if (data && data.length > 0) {
      renderChart(ctx, canvas, data);
    }
  }, [canvasRef, data, renderChart]);

  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(doRender);

    const handleResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(doRender);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [doRender, data]);

  return doRender;
}
