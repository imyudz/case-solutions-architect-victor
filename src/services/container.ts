//HTTP Client imports
import { AxiosHttpClient } from './httpClient';
import type { HttpClient } from './httpClient';

//WizardWorld API imports
import { WizardWorldApiServiceImpl } from './wizardWorldApi';
import type { WizardWorldApiService } from './wizardWorldApi';

//Analytics imports
import { AmplitudeAnalyticsService } from './analytics/amplitudeService';
import { ConsoleAnalyticsService, NoOpAnalyticsService } from './analytics/consoleService';
import type { AnalyticsService } from '../types/analytics';
import type { EventMap } from '../types/analytics';

export interface AppConfig {
  apiBaseUrl: string;
  enableAnalytics: boolean;
  analyticsConfig?: {
    provider?: 'noop' | 'console' | 'amplitude';
    environment: 'development' | 'production';
  };
}

const defaultConfig: AppConfig = {
  apiBaseUrl: 'https://wizard-world-api.herokuapp.com',
  enableAnalytics: true,
  analyticsConfig: {
    provider: 'console',
    environment: import.meta.env.MODE as 'development' | 'production'
  }
};

export class ServiceContainer {
  private readonly config: AppConfig;
  private httpClientInstance?: HttpClient;
  private analyticsServiceInstance?: AnalyticsService<EventMap>;
  private wizardWorldApiServiceInstance?: WizardWorldApiService;

  constructor(config: Partial<AppConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  getHttpClient(): HttpClient {
    if (!this.httpClientInstance) {
      this.httpClientInstance = new AxiosHttpClient(
        this.config.apiBaseUrl,
        {
          'Accept': 'application/json',
          'User-Agent': 'WizardWorld-App/1.0'
        }
      );
    }
    return this.httpClientInstance;
  }

  getAnalyticsService(): AnalyticsService<EventMap> {
    if (!this.analyticsServiceInstance) {
      if (!this.config.enableAnalytics) {
        this.analyticsServiceInstance = new NoOpAnalyticsService();
      } else {
        const provider = this.config.analyticsConfig?.provider;
        if (provider === 'amplitude') {
          this.analyticsServiceInstance = new AmplitudeAnalyticsService();
        } else if (provider === 'console' || this.config.analyticsConfig?.environment === 'development') {
          this.analyticsServiceInstance = new ConsoleAnalyticsService();
        } else {
          this.analyticsServiceInstance = new NoOpAnalyticsService();
        }
      }
    }
    return this.analyticsServiceInstance;
  }

  getWizardWorldApiService(): WizardWorldApiService {
    if (!this.wizardWorldApiServiceInstance) {
      this.wizardWorldApiServiceInstance = new WizardWorldApiServiceImpl(
        this.getHttpClient(),
        this.getAnalyticsService()
      );
    }
    return this.wizardWorldApiServiceInstance;
  }

  updateConfig(newConfig: Partial<AppConfig>): void {
    Object.assign(this.config, newConfig);
    this.httpClientInstance = undefined;
    this.analyticsServiceInstance = undefined;
    this.wizardWorldApiServiceInstance = undefined;
  }

  getConfig(): Readonly<AppConfig> {
    return { ...this.config };
  }
}


export const serviceContainer = new ServiceContainer({
  apiBaseUrl: 'https://wizard-world-api.herokuapp.com',
  enableAnalytics: true,
  analyticsConfig: {
    provider: 'amplitude',
    environment: import.meta.env.MODE as 'development' | 'production'
  }
});
