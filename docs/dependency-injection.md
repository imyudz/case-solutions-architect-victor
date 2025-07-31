# Injeção de Dependência

## 🎯 Objetivo

Sistema de injeção de dependência simples e eficaz que facilita testes, manutenção e extensibilidade do código, seguindo os princípios SOLID.

## 🏗️ Service Container

### **Arquitetura do Container**
```typescript
export class ServiceContainer {
  private readonly config: AppConfig;
  private httpClientInstance?: HttpClient;
  private analyticsServiceInstance?: AnalyticsService<EventMap>;
  private wizardWorldApiServiceInstance?: WizardWorldApiService;

  constructor(config: Partial<AppConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }
}
```

### **Padrão Singleton**
- Instância única por tipo de serviço
- Lazy initialization (criação sob demanda)
- Configuração centralizada

## 🔧 Configuração

### **AppConfig Interface**
```typescript
interface AppConfig {
  apiBaseUrl: string;
  enableAnalytics: boolean;
  analyticsConfig?: {
    provider?: 'noop' | 'console' | 'amplitude';
    environment: 'development' | 'production';
  };
}
```

### **Configuração Padrão**
```typescript
const defaultConfig: AppConfig = {
  apiBaseUrl: 'https://wizard-world-api.herokuapp.com',
  enableAnalytics: true,
  analyticsConfig: {
    provider: 'console',
    environment: import.meta.env.MODE as 'development' | 'production'
  }
};
```

## 🏭 Factory Methods

### **HTTP Client Factory**
```typescript
getHttpClient(): HttpClient {
  if (!this.httpClientInstance) {
    this.httpClientInstance = new AxiosHttpClient(
      this.config.apiBaseUrl,
      {
        'Accept': 'application/json'
      }
    );
  }
  return this.httpClientInstance;
}
```

### **Analytics Service Factory**
```typescript
getAnalyticsService(): AnalyticsService<EventMap> {
  if (!this.analyticsServiceInstance) {
    if (!this.config.enableAnalytics) {
      this.analyticsServiceInstance = new NoOpAnalyticsService();
    } else {
      const provider = this.config.analyticsConfig?.provider;
      switch (provider) {
        case 'amplitude':
          this.analyticsServiceInstance = new AmplitudeAnalyticsService();
          break;
        case 'console':
          this.analyticsServiceInstance = new ConsoleAnalyticsService();
          break;
        default:
          this.analyticsServiceInstance = new NoOpAnalyticsService();
      }
    }
  }
  return this.analyticsServiceInstance;
}
```

### **API Service Factory**
```typescript
getWizardWorldApiService(): WizardWorldApiService {
  if (!this.wizardWorldApiServiceInstance) {
    this.wizardWorldApiServiceInstance = new WizardWorldApiServiceImpl(
      this.getHttpClient(),
      this.getAnalyticsService()
    );
  }
  return this.wizardWorldApiServiceInstance;
}
```

## 🔄 Lifecycle Management

### **Configuração Dinâmica**
```typescript
updateConfig(newConfig: Partial<AppConfig>): void {
  Object.assign(this.config, newConfig);
  // Reset instances para recriar com nova config
  this.httpClientInstance = undefined;
  this.analyticsServiceInstance = undefined;
  this.wizardWorldApiServiceInstance = undefined;
}
```

### **Acesso à Configuração**
```typescript
getConfig(): Readonly<AppConfig> {
  return { ...this.config };
}
```

## 🎭 Instância Global

### **Container Singleton**
```typescript
export const serviceContainer = new ServiceContainer({
  apiBaseUrl: 'https://wizard-world-api.herokuapp.com',
  enableAnalytics: true,
  analyticsConfig: {
    provider: 'amplitude',
    environment: import.meta.env.MODE as 'development' | 'production'
  }
});
```

## 🔌 Uso nos Componentes

### **Em Providers**
```typescript
export function HousesProvider({ children }: HousesProviderProps) {
  const apiService = serviceContainer.getWizardWorldApiService();
  const analytics = serviceContainer.getAnalyticsService();
  
  // ... resto da implementação
}
```

### **Em Hooks**
```typescript
export function useAnalytics() {
  const analytics = serviceContainer.getAnalyticsService();
  
  // ... métodos do hook
}
```

## 🧪 Benefícios para Testes

### **Mock de Serviços**
```typescript
// Em testes
const mockContainer = new ServiceContainer({
  enableAnalytics: false,
  apiBaseUrl: 'http://localhost:3001'
});

// Override specific services
jest.spyOn(mockContainer, 'getAnalyticsService')
  .mockReturnValue(mockAnalyticsService);
```

### **Isolamento de Testes**
```typescript
beforeEach(() => {
  // Reset container state
  serviceContainer.updateConfig({
    enableAnalytics: false
  });
});
```

## 📦 Interfaces e Abstrações

### **HttpClient Interface**
```typescript
interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, data?: unknown): Promise<T>;
  put<T>(path: string, data?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}
```

### **AnalyticsService Interface**
```typescript
interface AnalyticsService<T> {
  track<K extends keyof T>(event: K, properties: T[K]): Promise<void>;
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>;
  setUserProperties(properties: Record<string, unknown>): Promise<void>;
}
```

## 🎯 Vantagens da Abordagem

### **Testabilidade**
- Fácil mock de dependências
- Isolamento de testes
- Configuração flexível por teste

### **Manutenibilidade**
- Acoplamento baixo
- Dependências explicitas
- Configuração centralizada

### **Extensibilidade**
- Novos serviços facilmente adicionados
- Implementações intercambiáveis
- Configuração por ambiente

### **Performance**
- Lazy loading de serviços
- Instâncias singleton
- Configuração cacheada