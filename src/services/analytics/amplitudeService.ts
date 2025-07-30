import type { AnalyticsService } from '../../types/analytics';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

export class AmplitudeAnalyticsService<E extends Record<string, unknown>> implements AnalyticsService<E>{
  private static initialized = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? import.meta.env.VITE_AMPLITUDE_KEY;
    this.init();
  }
  private readonly apiKey: string | undefined;

  private init() {
    if (AmplitudeAnalyticsService.initialized) return;
    if (!this.apiKey) {
      console.warn('Amplitude API key is not set. Analytics events will not be sent to Amplitude.');
      return;
    }
    
    try {
      amplitude.add(sessionReplayPlugin({ 
        sampleRate: 1
      }));
      
      amplitude.init(this.apiKey, {
        autocapture: true,
      });
      
      AmplitudeAnalyticsService.initialized = true;
      console.log('[Amplitude] Analytics initialized successfully');
    } catch (error) {
      console.error('[Amplitude] Failed to initialize:', error);
    }
  }

  async track<K extends keyof E>(event: K, properties: E[K]): Promise<void> {
    if (!AmplitudeAnalyticsService.initialized) {
      console.warn('Amplitude not initialized. Event not tracked:', event);
      return;
    }
    
    try {
      const enrichedProperties = {
        ...properties as Record<string, unknown>,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        app_version: '1.0.0',
        environment: import.meta.env.MODE
      };
      
      amplitude.track(String(event), enrichedProperties);
      console.log('[Amplitude] Event tracked:', event, enrichedProperties);
    } catch (error) {
      console.error('[Amplitude] Failed to track event:', event, error);
    }
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    if (!AmplitudeAnalyticsService.initialized) {
      console.warn('Amplitude not initialized. User not identified:', userId);
      return;
    }
    
    try {
      amplitude.setUserId(userId);
      
      if (traits) {
        const userProperties = {
          ...traits,
          last_seen: new Date().toISOString(),
          platform: navigator.platform,
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        const identifyEvent = new amplitude.Identify();
        Object.entries(userProperties).forEach(([key, value]) => {
          identifyEvent.setOnce(key, value);
        });
        amplitude.identify(identifyEvent);
      }
      
      console.log('[Amplitude] User identified:', userId, traits);
    } catch (error) {
      console.error('[Amplitude] Failed to identify user:', userId, error);
    }
  }

  async page(name: string, properties?: E['PageView']): Promise<void> {
    if (!AmplitudeAnalyticsService.initialized) {
      console.warn('Amplitude not initialized. Page view not tracked:', name);
      return;
    }
    
    try {
      const pageProperties = {
        ...properties as Record<string, unknown>,
        page_name: name,
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        user_agent: navigator.userAgent,
        app_version: '1.0.0',
        environment: import.meta.env.MODE
      };
      
      amplitude.track('Page View', pageProperties);
      
      console.log('[Amplitude] Page view tracked:', name, pageProperties);
    } catch (error) {
      console.error('[Amplitude] Failed to track page view:', name, error);
    }
  }

  async flush(): Promise<void> {
    if (!AmplitudeAnalyticsService.initialized) {
      return;
    }
    
    try {
      await amplitude.flush();
      console.log('[Amplitude] Events flushed successfully');
    } catch (error) {
      console.error('[Amplitude] Failed to flush events:', error);
    }
  }
}
