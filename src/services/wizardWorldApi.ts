import type { HouseDto } from '../types/api';
import type { HttpClient } from './httpClient';
import type { AnalyticsService } from './analytics';

export interface WizardWorldApiService {
  getHouses(): Promise<HouseDto[]>;
  getHouseById(id: string): Promise<HouseDto>;
}

export class WizardWorldApiServiceImpl implements WizardWorldApiService {
  private readonly httpClient: HttpClient;
  private readonly analytics: AnalyticsService;

  constructor(httpClient: HttpClient, analytics: AnalyticsService) {
    this.httpClient = httpClient;
    this.analytics = analytics;
  }

  async getHouses(): Promise<HouseDto[]> {
    try {
      await this.analytics.track({
        name: 'api_request_started',
        properties: {
          endpoint: '/Houses',
          method: 'GET'
        }
      });

      const houses = await this.httpClient.get<HouseDto[]>('/Houses');

      await this.analytics.track({
        name: 'api_request_success',
        properties: {
          endpoint: '/Houses',
          method: 'GET',
          count: houses.length
        }
      });

      return houses;
    } catch (error) {
      await this.analytics.track({
        name: 'api_request_error',
        properties: {
          endpoint: '/Houses',
          method: 'GET',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }
  }

  async getHouseById(id: string): Promise<HouseDto> {
    if (!id) {
      throw new Error('House ID is required');
    }

    try {
      await this.analytics.track({
        name: 'api_request_started',
        properties: {
          endpoint: `/Houses/${id}`,
          method: 'GET',
          houseId: id
        }
      });

      const house = await this.httpClient.get<HouseDto>(`/Houses/${id}`);

      await this.analytics.track({
        name: 'api_request_success',
        properties: {
          endpoint: `/Houses/${id}`,
          method: 'GET',
          houseId: id,
          houseName: house.name
        }
      });

      return house;
    } catch (error) {
      await this.analytics.track({
        name: 'api_request_error',
        properties: {
          endpoint: `/Houses/${id}`,
          method: 'GET',
          houseId: id,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }
  }
} 