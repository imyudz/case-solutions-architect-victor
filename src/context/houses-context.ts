import { createContext } from 'react';
import type { HouseDto, ApiError } from '../types/api';

// State interface
export interface HousesState {
  houses: HouseDto[];
  selectedHouse: HouseDto | null;
  loading: boolean;
  error: ApiError | null;
}

// Context interface
export interface HousesContextType {
  state: HousesState;
  fetchHouses: () => Promise<void>;
  fetchHouseById: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedHouse: () => void;
}

// Create context
export const HousesContext = createContext<HousesContextType | undefined>(undefined); 