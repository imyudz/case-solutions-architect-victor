export type EventMap = {
    PageView: { page_name: string; path?: string };
    ButtonClicked: { id: string; label?: string };
    ApiRequestStarted: { endpoint: string; method: string; houseId?: string };
    ApiRequestSuccess: { endpoint: string; method: string; houseId?: string; houseName?: string; count?: number };
    ApiRequestError: { endpoint: string; method: string; houseId?: string; error: string };
};

export interface AnalyticsService<E extends Record<string, unknown>> {
    track<K extends keyof E>(event: K, properties: E[K]): Promise<void>;
    identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
    page(name: string, properties?: E['PageView']): Promise<void>;
    flush(): Promise<void>;
}