export type EventMap = {
    PageView: { page_name: string; path?: string };
    
    ButtonClicked: { id: string; label?: string };
    HouseCardHovered: { house_id: string; house_name?: string; hover_duration?: number };
    TraitClicked: { trait_name: string; house_id?: string; house_name?: string };
    SearchPerformed: { query: string; results_count?: number };
    FilterApplied: { filter_type: string; filter_value: string };
    ScrollReachedBottom: { page_name: string; scroll_depth: number };
    
    ApiRequestStarted: { endpoint: string; method: string; houseId?: string };
    ApiRequestSuccess: { endpoint: string; method: string; houseId?: string; houseName?: string; count?: number; response_time?: number };
    ApiRequestError: { endpoint: string; method: string; houseId?: string; error: string; error_code?: string };
    
    ErrorOccurred: { error_type: string; error_message: string; page_name?: string; stack_trace?: string };
    ErrorBoundaryTriggered: { component_name: string; error_message: string; stack_trace?: string };
    
    SessionStarted: { session_id: string; platform?: string; user_agent?: string };
    SessionEnded: { session_id: string; session_duration: number; pages_visited: number };
    FeatureUsed: { feature_name: string; usage_context?: string };
    
    EmailCaptureAttempted: { house_name?: string; house_id?: string; email_domain: string };
    UserIdentified: { identification_method: string; house_name?: string; house_id?: string; user_id: string };
    EmailCaptureError: { house_name?: string; house_id?: string; error_message: string };
    EmailFieldFocused: { house_name?: string; house_id?: string };
    
    PageLoadCompleted: { page_name: string; load_time: number; performance_score?: number };
    ComponentRendered: { component_name: string; render_time: number };
};

export interface AnalyticsService<E extends Record<string, unknown>> {
    track<K extends keyof E>(event: K, properties: E[K]): Promise<void>;
    identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
    page(name: string, properties?: E['PageView']): Promise<void>;
    flush(): Promise<void>;
}