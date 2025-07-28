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
    try {
      await this.analytics.track('ApiRequestStarted', {
        endpoint: '/Houses',
        method: 'GET'
      });

      const houses = await this.httpClient.get<HouseDto[]>('/Houses');

      await this.analytics.track('ApiRequestSuccess', {
          endpoint: '/Houses',
        method: 'GET',
        count: houses.length
      });

      return houses;
    } catch (error) {
      await this.analytics.track('ApiRequestError', {
          endpoint: '/Houses',
        method: 'GET',
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  async getHouseById(id: string): Promise<HouseDto> {
    if (!id) {
      throw new Error('House ID is required');
    }

    try {
      await this.analytics.track('ApiRequestStarted', {
          endpoint: `/Houses/${id}`,
          method: 'GET',
          houseId: id
      });

      const house = await this.httpClient.get<HouseDto>(`/Houses/${id}`);

      await this.analytics.track('ApiRequestSuccess', {
          endpoint: `/Houses/${id}`,
          method: 'GET',
          houseId: id,
          houseName: house.name ?? undefined
      });

      return house;
    } catch (error) {
      await this.analytics.track('ApiRequestError', {
          endpoint: `/Houses/${id}`,
          method: 'GET',
        houseId: id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }
} 