// Core data shapes and shared types used across the FLAM dashboard

export type TimePeriod = '1m' | '5m' | '1h' | 'custom'

export interface DataPoint {
	/** Unix ms timestamp (primary) */
	t: number
	/** human-friendly alias for t */
	timestamp?: number
	/** numeric value */
	value: number
	/** optional 2D coordinates (for scatter/heatmap) */
	x?: number
	y?: number
	/** category or group label */
	category?: string
	/** status, e.g. 'ok' | 'warn' | 'error' */
	status?: string
	/** optional stable id */
	id?: number | string
	/** optional metadata for grouping/filters */
	meta?: Record<string, unknown>
}

export interface AggregatedPoint {
	start: number
	end: number
	avg: number
	min: number
	max: number
	count: number
}

export interface ApiResponse<T = any> {
	ok?: boolean
	data: T
	error?: string | null
}

// Chart-related props and config
export interface BaseChartProps {
	width?: number
	height?: number
	data?: DataPoint[]
	padding?: number
	className?: string
	// Called when pointer moves over a datapoint (or null when leaving)
	onHover?: (point: DataPoint | null) => void
}

export interface LineChartProps extends BaseChartProps {
	stroke?: string
	strokeWidth?: number
	smoothing?: boolean
}

export interface BarChartProps extends BaseChartProps {
	barWidth?: number
}

export interface ScatterPlotProps extends BaseChartProps {
	pointRadius?: number
}

export interface HeatmapProps extends BaseChartProps {
	cols?: number
	rows?: number
	// optional color mapper (value 0..1)
	colorScale?: (v: number) => string
}

// Filtering and time-range UI
export interface Filter {
	key: string
	operator?: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains'
	value: string | number | boolean | Array<string | number>
}

export interface FilterState {
	filters: Filter[]
}

export interface TimeRange {
	from: number
	to: number
	period?: TimePeriod
}

// Data streaming hook options and callback types
export type DataCallback = (points: DataPoint[]) => void

export interface DataStreamOptions {
	url?: string
	intervalMs?: number // for polling fallback
	batchSize?: number
	useSSE?: boolean
	autostart?: boolean
	onError?: (err: unknown) => void
}

// Renderer / chart surface abstractions
export interface ChartRenderer {
	render: (ctx: CanvasRenderingContext2D, data: DataPoint[], opts?: any) => void
	dispose?: () => void
}

// Virtualization types for data tables
export interface VirtualizedRange {
	start: number
	end: number
	total: number
}

export interface VirtualizationOptions {
	rowHeight: number
	overscan?: number
}

// Performance monitoring shapes
export interface PerformanceMetrics {
	fps: number
	memory?: MemoryUsage
	lastFrameDurationMs?: number
}

export interface MemoryUsage {
	totalJSHeapSize?: number
	usedJSHeapSize?: number
	jsHeapSizeLimit?: number
}

// Aggregation helper types
export type AggregationKey = '1m' | '5m' | '1h'

// Time aggregation modes used by the UI
export type TimeAggregation = 'raw' | '1min' | '5min' | '1hr'

// High-level chart selector
export type ChartType = 'all' | 'line' | 'bar' | 'scatter' | 'heatmap'

export interface AggregationOptions {
	period: AggregationKey
	// whether to align to natural boundaries (e.g., minute/hour)
	align?: boolean
}

// Utility types for internal hooks
export interface UseChartRendererResult {
	renderer: ChartRenderer | null
	attach: (canvas: HTMLCanvasElement) => void
	detach: () => void
}

export default DataPoint

