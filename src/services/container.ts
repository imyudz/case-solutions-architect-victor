import { AxiosHttpClient } from './httpClient';
import { ConsoleAnalyticsService, NoOpAnalyticsService } from './analytics';
import { WizardWorldApiServiceImpl } from './wizardWorldApi';
import type { HttpClient } from './httpClient';
import type { AnalyticsService } from './analytics';
import type { WizardWorldApiService } from './wizardWorldApi';

// Configuration interface
export interface AppConfig {
  apiBaseUrl: string;
  enableAnalytics: boolean;
  analyticsConfig?: {
    writeKey?: string;
    environment: 'development' | 'production';
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  apiBaseUrl: 'https://wizard-world-api.herokuapp.com',
  enableAnalytics: true,
  analyticsConfig: {
    environment: import.meta.env.MODE as 'development' | 'production'
  }
};

// Service container class
export class ServiceContainer {
  private readonly config: AppConfig;
  private httpClientInstance?: HttpClient;
  private analyticsServiceInstance?: AnalyticsService;
  private wizardWorldApiServiceInstance?: WizardWorldApiService;

  constructor(config: Partial<AppConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  // HTTP Client factory
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

  // Analytics Service factory
  getAnalyticsService(): AnalyticsService {
    if (!this.analyticsServiceInstance) {
      if (!this.config.enableAnalytics) {
        this.analyticsServiceInstance = new NoOpAnalyticsService();
      } else if (this.config.analyticsConfig?.environment === 'development') {
        this.analyticsServiceInstance = new ConsoleAnalyticsService();
      } else {
        // In production, you would instantiate the real analytics service here
        // Example: this.analyticsServiceInstance = new SegmentAnalyticsService(writeKey);
        this.analyticsServiceInstance = new ConsoleAnalyticsService();
      }
    }
    return this.analyticsServiceInstance;
  }

  // WizardWorld API Service factory
  getWizardWorldApiService(): WizardWorldApiService {
    if (!this.wizardWorldApiServiceInstance) {
      this.wizardWorldApiServiceInstance = new WizardWorldApiServiceImpl(
        this.getHttpClient(),
        this.getAnalyticsService()
      );
    }
    return this.wizardWorldApiServiceInstance;
  }

  // Update configuration
  updateConfig(newConfig: Partial<AppConfig>): void {
    Object.assign(this.config, newConfig);
    // Reset instances to apply new config
    this.httpClientInstance = undefined;
    this.analyticsServiceInstance = undefined;
    this.wizardWorldApiServiceInstance = undefined;
  }

  // Get current configuration
  getConfig(): Readonly<AppConfig> {
    return { ...this.config };
  }
}

// Global service container instance
export const serviceContainer = new ServiceContainer(); 