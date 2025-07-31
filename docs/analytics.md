# Sistema de Analytics

## 🎯 Objetivo

Sistema robusto de analytics para rastreamento de eventos, comportamento do usuário e monitoramento de performance, seguindo o padrão Strategy para suportar múltiplos providers.

## 🏗️ Arquitetura do Analytics

### **Strategy Pattern**
```typescript
interface AnalyticsService<T> {
  track<K extends keyof T>(event: K, properties: T[K]): Promise<void>;
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
  setUserProperties(properties: Record<string, unknown>): Promise<void>;
}
```

### **Implementações Disponíveis**

#### **1. AmplitudeAnalyticsService**
- **Produção**: Amplitude Analytics
- **Features**: Session replay, cohorts, funnels
- **Configuração**: API key automática

#### **2. ConsoleAnalyticsService** 
- **Desenvolvimento**: Console logging
- **Features**: Debug friendly, structured logs
- **Uso**: Desenvolvimento e testes

#### **3. NoOpAnalyticsService**
- **Fallback**: Operações vazias
- **Uso**: Quando analytics está desabilitado

## 📊 Eventos Rastreados

### **Mapa de Eventos**
```typescript
interface EventMap {
  // Navegação
  PageViewed: { page_name: string; referrer?: string };
  
  // Interações
  ButtonClicked: { id: string; label?: string };
  HouseCardHovered: { house_id: string; house_name?: string; hover_duration: number };
  TraitClicked: { trait_name: string; house_id?: string; house_name?: string };
  
  // API
  ApiRequestStarted: { endpoint: string; method: string; [key: string]: unknown };
  ApiRequestSuccess: { endpoint: string; method: string; response_time: number; [key: string]: unknown };
  ApiRequestError: { endpoint: string; method: string; error: string; error_code?: string };
  
  // Erros
  ErrorOccurred: { error_type: string; error_message: string; page_name?: string; stack_trace?: string };
}
```

## 🪝 Hook useAnalytics

### **API Simplificada**
```typescript
const {
  trackEvent,           // Evento genérico
  trackHouseCardHover,  // Hover em cards
  trackTraitClick,      // Click em traits
  trackButtonClick,     // Click em botões
  trackError,           // Erros manuais
  trackApiRequest,      // Requests de API
  identifyUser          // Identificação de usuário
} = useAnalytics();
```

### **Uso em Componentes**
```typescript
// Tracking de hover com duração
const handleHover = trackHouseCardHover(house.id, house.name);

// Tracking de cliques
const handleClick = () => {
  trackButtonClick('house_card_click', house.name);
  navigate(`/house/${house.id}`);
};
```

## 🔄 Integração Automática

### **Page Tracking**
```typescript
// Hook automático de página
export function usePageTracking() {
  const analytics = serviceContainer.getAnalyticsService();
  
  useEffect(() => {
    analytics.track('PageViewed', {
      page_name: location.pathname,
      referrer: document.referrer
    });
  }, [location.pathname]);
}
```

### **API Tracking**
```typescript
// Tracking automático em serviços
export class WizardWorldApiServiceImpl {
  async getHouses(): Promise<HouseDto[]> {
    const startTime = Date.now();
    
    await this.analytics.track('ApiRequestStarted', {
      endpoint: '/Houses',
      method: 'GET'
    });
    
    try {
      const houses = await this.httpClient.get<HouseDto[]>('/Houses');
      const responseTime = Date.now() - startTime;
      
      await this.analytics.track('ApiRequestSuccess', {
        endpoint: '/Houses',
        method: 'GET',
        count: houses.length,
        response_time: responseTime
      });
      
      return houses;
    } catch (error) {
      await this.analytics.track('ApiRequestError', {
        endpoint: '/Houses',
        method: 'GET',
        error: error.message
      });
      throw error;
    }
  }
}
```

## ⚙️ Configuração por Ambiente

### **Development**
```typescript
// Console logging para debug
analyticsConfig: {
  provider: 'console',
  environment: 'development'
}
```

### **Production**
```typescript
// Amplitude com session replay
analyticsConfig: {
  provider: 'amplitude',
  environment: 'production'
}
```

## 📈 Métricas Coletadas

### **User Behavior**
- Navegação entre páginas
- Tempo de hover em elementos
- Cliques e interações
- Jornada do usuário

### **Performance**
- Tempo de resposta da API
- Erros de rede
- Loading times
- Error rates

### **Technical**
- Erros de JavaScript
- Stack traces
- Browser information
- Device metrics

## 🛡️ Privacy & Compliance

### **Data Collection**
- Dados anonimizados por padrão
- Sem PII (Personally Identifiable Information)
- Opt-out disponível
- GDPR compliance ready

### **Error Handling**
```typescript
// Tracking de erros não afeta UX
try {
  await analytics.track(event, properties);
} catch (analyticsError) {
  // Falha silenciosa em analytics
  console.warn('Analytics tracking failed:', analyticsError);
}
```

## 🔧 Configuração e Setup

### **Environment Variables**
```bash
# .env.production
VITE_AMPLITUDE_API_KEY=your_amplitude_key
VITE_ENABLE_ANALYTICS=true

# .env.development
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_PROVIDER=console
```

### **Service Container**
```typescript
export const serviceContainer = new ServiceContainer({
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  analyticsConfig: {
    provider: import.meta.env.VITE_ANALYTICS_PROVIDER || 'amplitude',
    environment: import.meta.env.MODE
  }
});
```

## 🔮 Extensibilidade

### **Novos Providers**
1. Implementar `AnalyticsService<EventMap>`
2. Adicionar ao container de serviços
3. Configurar via environment

### **Novos Eventos**
1. Atualizar `EventMap` interface
2. Criar métodos específicos no hook
3. Implementar tracking nos componentes

### **Custom Properties**
- Contexto do usuário
- Feature flags
- A/B test groups
- Custom dimensions