// analytics/providers/amplitude.ts
import type { AnalyticsService } from '../../types/analytics';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

export class AmplitudeAnalyticsService<E extends Record<string, unknown>> implements AnalyticsService<E>{
  private static initialized = false;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? import.meta.env.AMPLITUDE_API_KEY;
    this.init();
  }
  private readonly apiKey: string | undefined;

  private init() {
    if (AmplitudeAnalyticsService.initialized) return;
    if (!this.apiKey) {
      console.warn('Amplitude API key is not set. Using fallback behavior.');
      return;
    }
    amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
    amplitude.init(this.apiKey, { autocapture: true });
    AmplitudeAnalyticsService.initialized = true;
  }

  async track<K extends keyof E>(event: K, properties: E[K]): Promise<void> {
    if (!AmplitudeAnalyticsService.initialized) {
      console.warn('Amplitude not initialized. Event not tracked:', event);
      return;
    }
    amplitude.track(String(event), properties as Record<string, unknown>);
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    void userId;
    void traits;
  }

  async page(name: string, properties?: E['PageView']): Promise<void> {
    void name;
    void properties;
  }

  async flush(): Promise<void> {
    return;
  }
}
