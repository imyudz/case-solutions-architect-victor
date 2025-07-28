export type EventMap = {
    PageView: { page_name: string; path?: string };
    ButtonClicked: { id: string; label?: string };
};

export interface AnalyticsService<E extends Record<string, unknown>> {
    track<K extends keyof E>(event: K, properties: E[K]): Promise<void>;
    identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
    page(name: string, properties?: E['PageView']): Promise<void>;
    flush(): Promise<void>;
}