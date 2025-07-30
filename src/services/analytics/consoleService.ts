import type { AnalyticsService } from '../../types/analytics';

export class NoOpAnalyticsService<E extends Record<string, unknown>> implements AnalyticsService<E> {
    async track(): Promise<void> {}
    async identify(): Promise<void> {}
    async page(): Promise<void> {}
    async flush(): Promise<void> {}
}

export class ConsoleAnalyticsService<E extends Record<string, unknown>> implements AnalyticsService<E> {
    async track<K extends keyof E>(event: K, properties: E[K]): Promise<void> {
        console.log('[Analytics] Track:', event as string, properties);
    }
    async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
        console.log('[Analytics] Identify:', { userId, traits });
    }
    async page(name: string, properties?: E['PageView']): Promise<void> {
        console.log('[Analytics] Page:', { name, properties });
    }
    async flush(): Promise<void> {
        console.log('[Analytics] Flush');
    }
}
