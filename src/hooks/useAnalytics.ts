import { useCallback, useRef } from 'react';
import { serviceContainer } from '../services/container';
import type { EventMap } from '../types/analytics';

export function useAnalytics() {
  const analytics = serviceContainer.getAnalyticsService();
  const hoverTimers = useRef<Map<string, number>>(new Map());

  const trackEvent = useCallback(<K extends keyof EventMap>(
    event: K, 
    properties: EventMap[K]
  ) => {
    analytics.track(event, properties);
  }, [analytics]);

  const trackHouseCardHover = useCallback((houseId: string, houseName?: string) => {
    const startTime = Date.now();
    hoverTimers.current.set(houseId, startTime);

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      hoverTimers.current.delete(houseId);
      
      trackEvent('HouseCardHovered', {
        house_id: houseId,
        house_name: houseName,
        hover_duration: duration
      });
    };
  }, [trackEvent]);

  const trackTraitClick = useCallback((traitName: string, houseId?: string, houseName?: string) => {
    trackEvent('TraitClicked', {
      trait_name: traitName,
      house_id: houseId,
      house_name: houseName
    });
  }, [trackEvent]);

  const trackButtonClick = useCallback((id: string, label?: string) => {
    trackEvent('ButtonClicked', {
      id,
      label
    });
  }, [trackEvent]);

  const trackError = useCallback((errorType: string, errorMessage: string, pageName?: string, stackTrace?: string) => {
    trackEvent('ErrorOccurred', {
      error_type: errorType,
      error_message: errorMessage,
      page_name: pageName,
      stack_trace: stackTrace
    });
  }, [trackEvent]);

  const trackApiRequest = useCallback((
    endpoint: string, 
    method: string, 
    type: 'started' | 'success' | 'error',
    additionalData?: Record<string, unknown>
  ) => {
    switch (type) {
      case 'started':
        trackEvent('ApiRequestStarted', {
          endpoint,
          method,
          ...additionalData
        });
        break;
      case 'success':
        trackEvent('ApiRequestSuccess', {
          endpoint,
          method,
          ...additionalData
        });
        break;
      case 'error':
        trackEvent('ApiRequestError', {
          endpoint,
          method,
          error: additionalData?.error as string || 'Unknown error',
          error_code: additionalData?.error_code as string,
          ...additionalData
        });
        break;
    }
  }, [trackEvent]);

  const identifyUser = useCallback((userId: string, traits?: Record<string, unknown>) => {
    analytics.identify(userId, traits);
  }, [analytics]);

  return {
    trackEvent,
    trackHouseCardHover,
    trackTraitClick,
    trackButtonClick,
    trackError,
    trackApiRequest,
    identifyUser,
    analytics
  };
} 