import React, { useEffect, useCallback, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * Production-Grade ECharts Resizing Hook (Refructured & Enhanced)
 * Handles ResizeObserver (layout shifts), Smart Retries (animations/mount),
 * and Global Resize fallbacks with cross-browser polyfill.
 */
export const useChartResize = (chartRef: React.RefObject<any>, dependency?: any) => {
  const resizeCount = useRef(0);
  const maxRetries = 10;
  
  const triggerResize = useCallback(() => {
    if (chartRef.current) {
      try {
        const instance = chartRef.current.getEchartsInstance();
        if (instance) {
          instance.resize();
        }
      } catch (err) {
        // Silently fail if instance isn't ready
      }
    }
  }, [chartRef]);

  useEffect(() => {
    if (!chartRef.current) return;

    // 1. ResizeObserver for Container Shifts (Sidebar, Grid, flex-grow)
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Only resize if we have meaningful dimensions
        if (width > 0 && height > 0) {
          window.requestAnimationFrame(triggerResize);
        }
      }
    });

    // Access the container element from echarts-for-react
    const container = chartRef.current.ele;
    if (container) {
      observer.observe(container);
    }

    // 2. Immediate & Delayed Retries
    // This is crucial for fixing the "small width on refresh" bug
    const retry = () => {
      triggerResize();
      if (resizeCount.current < maxRetries) {
        resizeCount.current++;
        setTimeout(retry, resizeCount.current * 200); // Incremental delay
      }
    };

    // Reset counter on dependency change (e.g. city change)
    resizeCount.current = 0;
    retry();

    // 3. Fallback for common events
    window.addEventListener('resize', triggerResize);
    window.addEventListener('load', triggerResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', triggerResize);
      window.removeEventListener('load', triggerResize);
      resizeCount.current = maxRetries + 1; // Stop timeouts
    };
  }, [chartRef, triggerResize, dependency]);
};
