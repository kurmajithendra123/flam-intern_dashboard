// Simple virtualization hook placeholder for data tables
export const useVirtualization = () => {
  return {
    getVisibleRange: (scrollTop: number, rowHeight: number) => ({ start: 0, end: 50 })
  }
}
