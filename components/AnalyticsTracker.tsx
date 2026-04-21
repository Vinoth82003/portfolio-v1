'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid'; // Need to check if uuid is installed, otherwise use a simple crypto.randomUUID

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Initialize session ID
    if (typeof window !== 'undefined') {
      let storedSessionId = sessionStorage.getItem('portfolio_session_id');
      if (!storedSessionId) {
        storedSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('portfolio_session_id', storedSessionId);
      }
      sessionIdRef.current = storedSessionId;
    }

    // Track initial page view
    trackPageView(pathname);

    // Track session end on unload
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackSessionEnd();
      } else {
        startTimeRef.current = Date.now();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', trackSessionEnd);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', trackSessionEnd);
    };
  }, []);

  // Track page view on path change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  const trackPageView = (path: string) => {
    if (!sessionIdRef.current) return;

    const data = {
      type: 'PAGE_VIEW',
      path,
      sessionId: sessionIdRef.current,
      metadata: {
        browser: navigator.userAgent,
        referrer: document.referrer,
      }
    };

    // Use sendBeacon for lightweight tracking that doesn't block the UI
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(data));
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    }
  };

  const trackSessionEnd = () => {
    if (!sessionIdRef.current) return;

    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    if (duration < 1) return; // Ignore very short sessions

    const data = {
      type: 'SESSION_END',
      path: pathname,
      sessionId: sessionIdRef.current,
      duration,
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', JSON.stringify(data));
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    }
  };

  return null;
}
