import { createContext } from 'react';
import type { HouseDto, ApiError } from '../types/api';

export interface HousesState {
  houses: HouseDto[];
  selectedHouse: HouseDto | null;
  loading: boolean;
  error: ApiError | null;
}

export interface HousesContextType {
  state: HousesState;
  fetchHouses: () => Promise<void>;
  fetchHouseById: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedHouse: () => void;
}

export const HousesContext = createContext<HousesContextType | undefined>(undefined); 