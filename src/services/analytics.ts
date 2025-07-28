// Analytics service interface for dependency injection
// This allows easy integration with different analytics SDKs without changing source code

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsService {
  track(event: AnalyticsEvent): Promise<void>;
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
  page(name: string, properties?: Record<string, unknown>): Promise<void>;
  flush(): Promise<void>;
}

// Default implementation (no-op) for when analytics is disabled
export class NoOpAnalyticsService implements AnalyticsService {
  async track(event: AnalyticsEvent): Promise<void> {
    void event; // No-op
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    void userId;
    void traits; // No-op
  }

  async page(name: string, properties?: Record<string, unknown>): Promise<void> {
    void name;
    void properties; // No-op
  }

  async flush(): Promise<void> {
    // No-op
  }
}

// Console implementation for development
export class ConsoleAnalyticsService implements AnalyticsService {
  async track(event: AnalyticsEvent): Promise<void> {
    console.log('[Analytics] Track:', event);
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    console.log('[Analytics] Identify:', { userId, traits });
  }

  async page(name: string, properties?: Record<string, unknown>): Promise<void> {
    console.log('[Analytics] Page:', { name, properties });
  }

  async flush(): Promise<void> {
    console.log('[Analytics] Flush');
  }
}

// Example implementation for Segment SDK (commented out as example)
/*
export class SegmentAnalyticsService implements AnalyticsService {
  private analytics: any;

  constructor(writeKey: string) {
    // this.analytics = Analytics(writeKey);
  }

  async track(event: AnalyticsEvent): Promise<void> {
    // this.analytics.track(event.name, event.properties, { userId: event.userId });
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    // this.analytics.identify(userId, traits);
  }

  async page(name: string, properties?: Record<string, unknown>): Promise<void> {
    // this.analytics.page(name, properties);
  }

  async flush(): Promise<void> {
    // await this.analytics.flush();
  }
}
*/ 