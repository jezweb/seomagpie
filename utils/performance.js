export function getPageSpeedMetrics() {
  return {
    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
  };
}