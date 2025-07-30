import type { HouseDto } from '../types/api';
import type { HttpClient } from './httpClient';
import type { AnalyticsService } from '../types/analytics';
import type { EventMap } from '../types/analytics';

export interface WizardWorldApiService {
  getHouses(): Promise<HouseDto[]>;
  getHouseById(id: string): Promise<HouseDto>;
}

export class WizardWorldApiServiceImpl implements WizardWorldApiService {
  private readonly httpClient: HttpClient;
  private readonly analytics: AnalyticsService<EventMap>;

  constructor(httpClient: HttpClient, analytics: AnalyticsService<EventMap>) {
    this.httpClient = httpClient;
    this.analytics = analytics;
  }

  async getHouses(): Promise<HouseDto[]> {
    const startTime = Date.now();
    
    try {
      await this.analytics.track('ApiRequestStarted', {
        endpoint: '/Houses',
        method: 'GET'
      });

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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = error instanceof Error && 'code' in error ? String(error.code) : undefined;

      await this.analytics.track('ApiRequestError', {
        endpoint: '/Houses',
        method: 'GET',
        error: errorMessage,
        error_code: errorCode
      });

      await this.analytics.track('ErrorOccurred', {
        error_type: 'API Request Failed',
        error_message: `Failed to fetch houses: ${errorMessage}`,
        page_name: window.location.pathname
      });

      throw error;
    }
  }

  async getHouseById(id: string): Promise<HouseDto> {
    if (!id) {
      const error = new Error('House ID is required');
      await this.analytics.track('ErrorOccurred', {
        error_type: 'Validation Error',
        error_message: error.message,
        page_name: window.location.pathname
      });
      throw error;
    }

    const startTime = Date.now();

    try {
      await this.analytics.track('ApiRequestStarted', {
        endpoint: `/Houses/${id}`,
        method: 'GET',
        houseId: id
      });

      const house = await this.httpClient.get<HouseDto>(`/Houses/${id}`);
      const responseTime = Date.now() - startTime;

      await this.analytics.track('ApiRequestSuccess', {
        endpoint: `/Houses/${id}`,
        method: 'GET',
        houseId: id,
        houseName: house.name || undefined,
        response_time: responseTime
      });

      return house;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = error instanceof Error && 'code' in error ? String(error.code) : undefined;

      await this.analytics.track('ApiRequestError', {
        endpoint: `/Houses/${id}`,
        method: 'GET',
        houseId: id,
        error: errorMessage,
        error_code: errorCode
      });

      await this.analytics.track('ErrorOccurred', {
        error_type: 'API Request Failed',
        error_message: `Failed to fetch house ${id}: ${errorMessage}`,
        page_name: window.location.pathname
      });

      throw error;
    }
  }
} 