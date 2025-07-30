import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { serviceContainer } from '../services/container';
import { detectPlatform } from '../utils/platformUtils';

export function usePageTracking() {
  const location = useLocation();
  const analytics = serviceContainer.getAnalyticsService();
  const sessionStart = useRef<number>(Date.now());
  const lastPageTime = useRef<number>(Date.now());

  useEffect(() => {
    const pageStartTime = Date.now();
    
    const getPageName = (pathname: string) => {
      if (pathname === '/' || pathname === '/houses') return 'houses_list';
      if (pathname.startsWith('/house/')) return 'house_detail';
      return 'unknown';
    };

    const pageName = getPageName(location.pathname);
    
    // Send Page View - for house_detail, detailed tracking is done in HouseDetailPage.tsx
    if (pageName !== 'house_detail') {
      analytics.page(pageName, {
        page_name: pageName,
        path: location.pathname
      });
    }

    // Track session start only once  
    if (Date.now() - sessionStart.current < 1000) {
      const sessionId = crypto.randomUUID();

      analytics.track('SessionStarted', {
        session_id: sessionId,
        app_platform: detectPlatform(),
        user_agent: navigator.userAgent
      });
    }

    const trackPageLoad = () => {
      const loadTime = Date.now() - pageStartTime;
      analytics.track('PageLoadCompleted', {
        page_name: pageName,
        load_time: loadTime
      });
    };

    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad, { once: true });
    }

    const trackScrollDepth = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent >= 90) {
        analytics.track('ScrollReachedBottom', {
          page_name: pageName,
          scroll_depth: scrollPercent
        });
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(trackScrollDepth, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    lastPageTime.current = Date.now();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [location.pathname, analytics]);

  return {
    trackEvent: analytics.track.bind(analytics)
  };
} 