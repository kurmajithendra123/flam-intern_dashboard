import { DataPoint, TimeAggregation, AggregatedPoint } from './types';

const categories = ['CPU', 'Memory', 'Network', 'Disk', 'Database'];
const statusOptions = ['ok', 'warn', 'error'] as const;

let lastTimestamp = Date.now();
let idCounter = 0;

export function generateDataPoints(count: number = 100): DataPoint[] {
  const points: DataPoint[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const timestamp = lastTimestamp + i * 10;
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Generate value with some category-specific patterns
    let baseValue = 100;
    if (category === 'CPU') baseValue = 80 + Math.random() * 40;
    if (category === 'Memory') baseValue = 60 + Math.random() * 60;
    if (category === 'Network') baseValue = 40 + Math.random() * 80;
    if (category === 'Disk') baseValue = 90 + Math.random() * 30;
    if (category === 'Database') baseValue = 70 + Math.random() * 50;

    // Add some noise
    const value = baseValue + Math.sin(timestamp / 1000) * 20 + (Math.random() - 0.5) * 10;

    // Status based on value
    let status: 'ok' | 'warn' | 'error' = 'ok';
    if (value > 130) status = 'error';
    else if (value > 110) status = 'warn';

    points.push({
      t: timestamp,
      timestamp,
      value: Math.max(0, value),
      x: Math.random() * 100,
      y: Math.random() * 100,
      category,
      status,
      id: idCounter++
    });
  }

  lastTimestamp = now + count * 10;
  return points;
}

export function aggregateData(data: DataPoint[], period: TimeAggregation): DataPoint[] {
  if (period === 'raw' || data.length === 0) return data;

  const intervalMs = period === '1min' ? 60000 : period === '5min' ? 300000 : 3600000;
  
  const buckets: Map<number, DataPoint[]> = new Map();

  data.forEach(point => {
    const bucketKey = Math.floor((point.t || point.timestamp || 0) / intervalMs) * intervalMs;
    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, []);
    }
    buckets.get(bucketKey)!.push(point);
  });

  const aggregated: DataPoint[] = [];
  
  buckets.forEach((points, bucketTime) => {
    const values = points.map(p => p.value);
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Use the most common category in this bucket
    const categoryCounts: Record<string, number> = {};
    points.forEach(p => {
      const cat = p.category || 'unknown';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const category = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];

    aggregated.push({
      t: bucketTime,
      timestamp: bucketTime,
      value: avgValue,
      x: points[0].x,
      y: points[0].y,
      category,
      status: avgValue > 130 ? 'error' : avgValue > 110 ? 'warn' : 'ok'
    });
  });

  return aggregated.sort((a, b) => (a.t || 0) - (b.t || 0));
}
