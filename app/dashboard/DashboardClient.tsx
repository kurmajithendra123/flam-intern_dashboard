'use client';

import React, { useState, useMemo } from 'react';
import { DataPoint, ChartType, TimeAggregation } from '@/lib/types';
import { useDataStream } from '@/hooks/useDataStream';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { aggregateData } from '@/lib/dataGenerator';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import ScatterPlot from '@/components/charts/ScatterPlot';
import Heatmap from '@/components/charts/Heatmap';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import DataTable from '@/components/ui/DataTable';
import FilterPanel from '@/components/controls/FilterPanel';
import TimeRangeSelector from '@/components/controls/TimeRangeSelector';

interface DashboardClientProps {
  initialData: DataPoint[];
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const {
    data,
    isRunning,
    start,
    pause,
    clear,
    stressTest,
    setUpdateInterval,
    setPointsPerUpdate,
    updateInterval,
    pointsPerUpdate
  } = useDataStream(initialData);

  const [chartType, setChartType] = useState<ChartType>('all');
  const [aggregation, setAggregation] = useState<TimeAggregation>('raw');

  const metrics = usePerformanceMonitor(data.length);
  const processedData = useMemo(() => aggregateData(data, aggregation), [data, aggregation]);
  const displayData = useMemo(() => processedData.slice(-1000), [processedData]);

  // Calculate real-time statistics
  const stats = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };
    
    const values = data.map(d => d.value).sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      median: values[Math.floor(values.length / 2)]
    };
  }, [data]);

  // Export data as CSV
  const exportData = () => {
    if (data.length === 0) {
      alert('No data to export!');
      return;
    }

    const headers = ['Timestamp', 'Value', 'Category', 'Status', 'X', 'Y'];
    const rows = data.map(d => [
      new Date(d.t || d.timestamp || 0).toISOString(),
      d.value.toFixed(2),
      d.category || 'N/A',
      d.status || 'ok',
      (d.x || 0).toFixed(2),
      (d.y || 0).toFixed(2)
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-dashboard-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add this BEFORE the return statement:

// Real-time health status
const overallHealth = useMemo(() => {
  if (stats.max > 130) return { status: 'critical', color: 'text-red-500', bg: 'bg-red-500/20' };
  if (stats.max > 110) return { status: 'warning', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
  return { status: 'healthy', color: 'text-green-500', bg: 'bg-green-500/20' };
}, [stats.max]);

// Then add this AFTER the header section:

{/* System Health Status */}
<div className={`${overallHealth.bg} backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-xl`}>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${overallHealth.color} animate-pulse`} />
      <span className="text-sm font-semibold uppercase tracking-wide">System Status</span>
    </div>
    <span className={`text-lg font-bold ${overallHealth.color} uppercase`}>
      {overallHealth.status}
    </span>
  </div>
  <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
    <div 
      className={`h-full transition-all duration-500 ${
        overallHealth.status === 'critical' ? 'bg-red-500 w-full' :
        overallHealth.status === 'warning' ? 'bg-yellow-500 w-2/3' :
        'bg-green-500 w-1/3'
      }`}
    />
  </div>
</div>
// Add this helper function BEFORE return:

const getMetricColor = (value: number, max: number) => {
  const percentage = (value / max) * 100;
  if (percentage > 80) return 'from-red-500 to-red-600';
  if (percentage > 60) return 'from-yellow-500 to-yellow-600';
  return 'from-green-500 to-green-600';
};

// Replace the statistics cards section with THIS:

{/* Enhanced Statistics with Progress Bars */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md rounded-lg p-4 border border-blue-500/30">
    <div className="flex items-center justify-between mb-2">
      <div className="text-xs text-blue-400 uppercase font-semibold">Min Value</div>
      <span className="text-2xl font-bold text-white">{stats.min.toFixed(2)}</span>
    </div>
    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
      <div className="h-full w-1/4 bg-blue-500" />
    </div>
    <div className="text-xs text-gray-400 mt-1">Lowest recorded</div>
  </div>

  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md rounded-lg p-4 border border-green-500/30">
    <div className="flex items-center justify-between mb-2">
      <div className="text-xs text-green-400 uppercase font-semibold">Max Value</div>
      <span className="text-2xl font-bold text-white">{stats.max.toFixed(2)}</span>
    </div>
    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${getMetricColor(stats.max, 150)} transition-all duration-500`} style={{width: `${Math.min((stats.max / 150) * 100, 100)}%`}} />
    </div>
    <div className="text-xs text-gray-400 mt-1">Highest recorded</div>
  </div>

  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
    <div className="flex items-center justify-between mb-2">
      <div className="text-xs text-purple-400 uppercase font-semibold">Average</div>
      <span className="text-2xl font-bold text-white">{stats.avg.toFixed(2)}</span>
    </div>
    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${getMetricColor(stats.avg, 150)} transition-all duration-500`} style={{width: `${Math.min((stats.avg / 150) * 100, 100)}%`}} />
    </div>
    <div className="text-xs text-gray-400 mt-1">Mean of all values</div>
  </div>

  <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 backdrop-blur-md rounded-lg p-4 border border-pink-500/30">
    <div className="flex items-center justify-between mb-2">
      <div className="text-xs text-pink-400 uppercase font-semibold">Median</div>
      <span className="text-2xl font-bold text-white">{stats.median.toFixed(2)}</span>
    </div>
    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${getMetricColor(stats.median, 150)} transition-all duration-500`} style={{width: `${Math.min((stats.median / 150) * 100, 100)}%`}} />
    </div>
    <div className="text-xs text-gray-400 mt-1">Middle value</div>
  </div>
</div>


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              IT Infrastructure Monitoring Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Real-time system performance tracking for CPU, Memory, Network, Disk & Database metrics</p>
          </div>
          <PerformanceMonitor metrics={metrics} />
        </div>

        {/* Real-time Statistics Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md rounded-lg p-4 border border-blue-500/30">
            <div className="text-xs text-blue-400 uppercase font-semibold mb-1">Min Value</div>
            <div className="text-2xl font-bold text-white">{stats.min.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">Lowest recorded metric</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md rounded-lg p-4 border border-green-500/30">
            <div className="text-xs text-green-400 uppercase font-semibold mb-1">Max Value</div>
            <div className="text-2xl font-bold text-white">{stats.max.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">Highest recorded metric</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-md rounded-lg p-4 border border-purple-500/30">
            <div className="text-xs text-purple-400 uppercase font-semibold mb-1">Average</div>
            <div className="text-2xl font-bold text-white">{stats.avg.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">Mean of all values</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 backdrop-blur-md rounded-lg p-4 border border-pink-500/30">
            <div className="text-xs text-pink-400 uppercase font-semibold mb-1">Median</div>
            <div className="text-2xl font-bold text-white">{stats.median.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">Middle value</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-xl p-6 space-y-6 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FilterPanel chartType={chartType} onChartTypeChange={setChartType} />
            <TimeRangeSelector aggregation={aggregation} onAggregationChange={setAggregation} />
            
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Update Speed (ms)</label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-center text-blue-400 font-medium">{updateInterval}ms</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Points Per Update</label>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={pointsPerUpdate}
                onChange={(e) => setPointsPerUpdate(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm text-center text-blue-400 font-medium">{pointsPerUpdate} points</span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={isRunning ? pause : start}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95"
            >
              {isRunning ? '⏸ Pause' : '▶ Start'} Streaming
            </button>
            <button
              onClick={clear}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 active:scale-95"
            >
              🗑 Clear Data
            </button>
            <button
              onClick={stressTest}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50 active:scale-95"
            >
              ⚡ Stress Test (+5000 points)
            </button>
            <button
              onClick={exportData}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 active:scale-95"
            >
              💾 Export CSV
            </button>
          </div>

          <div className="text-sm text-gray-400 flex gap-4">
            <span>📊 Total Points: <span className="text-white font-semibold">{data.length.toLocaleString()}</span></span>
            <span>📈 Displayed: <span className="text-white font-semibold">{displayData.length.toLocaleString()}</span></span>
            <span>🔄 Aggregation: <span className="text-white font-semibold">{aggregation}</span></span>
          </div>
        </div>

        {/* Line Chart */}
        {(chartType === 'all' || chartType === 'line') && (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📈 Line Chart - Trend Analysis Over Time
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Real-time view of system metrics. Track how CPU, Memory, Network, Disk, and Database performance changes every 100ms. Use this to identify trends and predict potential issues before they occur.
              </p>
            </div>
            <LineChart data={displayData} />
          </div>
        )}

        {/* Bar Chart */}
        {(chartType === 'all' || chartType === 'bar') && (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📊 Bar Chart - Metric Category Comparison
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Compare average performance across different system categories. Quickly identify which resource (CPU/Memory/Network/Disk/Database) is under the most load and requires immediate attention.
              </p>
            </div>
            <BarChart data={displayData} />
          </div>
        )}

        {/* Scatter Plot */}
        {(chartType === 'all' || chartType === 'scatter') && (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🎯 Scatter Plot - Correlation & Pattern Analysis
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Visualize relationships between two metric dimensions. <span className="text-green-400">Green dots</span> indicate healthy status, <span className="text-yellow-400">yellow</span> for warnings, <span className="text-red-400">red</span> for critical errors. Use this to find correlations like "high CPU = high memory usage".
              </p>
            </div>
            <ScatterPlot data={displayData} />
          </div>
        )}

        {/* Heatmap */}
        {(chartType === 'all' || chartType === 'heatmap') && (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                🔥 Heatmap - Density & Distribution Visualization
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Shows where data points cluster most frequently. Darker blue areas indicate higher activity in that value range. This helps identify normal operating zones and spot anomalies outside typical patterns.
              </p>
            </div>
            <Heatmap data={displayData} />
          </div>
        )}

        {/* Data Table */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-2xl">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">📋 Raw Data Table (Last 100 entries)</h2>
            <p className="text-sm text-gray-400 mt-1">
              Detailed view of individual data points with timestamps, values, categories, and status indicators. Virtual scrolling enabled for performance with large datasets.
            </p>
          </div>
          <DataTable data={data} />
        </div>

      </div>
    </div>
  );
}
