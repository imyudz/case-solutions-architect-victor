import { useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ApiError } from '../types/api';
import { serviceContainer } from '../services/container';
import { HousesContext, type HousesState, type HousesContextType } from './houses-context';

// Action types
type HousesAction =
  | { type: 'FETCH_HOUSES_START' }
  | { type: 'FETCH_HOUSES_SUCCESS'; payload: import('../types/api').HouseDto[] }
  | { type: 'FETCH_HOUSES_ERROR'; payload: ApiError }
  | { type: 'FETCH_HOUSE_START' }
  | { type: 'FETCH_HOUSE_SUCCESS'; payload: import('../types/api').HouseDto }
  | { type: 'FETCH_HOUSE_ERROR'; payload: ApiError }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_SELECTED_HOUSE' };

// Initial state
const initialState: HousesState = {
  houses: [],
  selectedHouse: null,
  loading: false,
  error: null,
};

// Reducer
function housesReducer(state: HousesState, action: HousesAction): HousesState {
  switch (action.type) {
    case 'FETCH_HOUSES_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_HOUSES_SUCCESS':
      return {
        ...state,
        houses: action.payload,
        loading: false,
        error: null,
      };

    case 'FETCH_HOUSES_ERROR':
      return {
        ...state,
        houses: [],
        loading: false,
        error: action.payload,
      };

    case 'FETCH_HOUSE_START':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'FETCH_HOUSE_SUCCESS':
      return {
        ...state,
        selectedHouse: action.payload,
        loading: false,
        error: null,
      };

    case 'FETCH_HOUSE_ERROR':
      return {
        ...state,
        selectedHouse: null,
        loading: false,
        error: action.payload,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'CLEAR_SELECTED_HOUSE':
      return {
        ...state,
        selectedHouse: null,
      };

    default:
      return state;
  }
}

// Provider component
interface HousesProviderProps {
  children: ReactNode;
}

export function HousesProvider({ children }: HousesProviderProps) {
  const [state, dispatch] = useReducer(housesReducer, initialState);
  const apiService = serviceContainer.getWizardWorldApiService();
  const analytics = serviceContainer.getAnalyticsService();

  const fetchHouses = useCallback(async () => {
    dispatch({ type: 'FETCH_HOUSES_START' });

    try {
      await analytics.track({
        name: 'houses_fetch_initiated',
        properties: { source: 'houses_context' }
      });

      const houses = await apiService.getHouses();
      
      dispatch({ type: 'FETCH_HOUSES_SUCCESS', payload: houses });

      await analytics.track({
        name: 'houses_fetch_success',
        properties: { 
          count: houses.length,
          source: 'houses_context'
        }
      });
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Failed to fetch houses',
        status: error && typeof error === 'object' && 'status' in error ? (error as { status: number }).status : undefined,
        code: error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : undefined,
      };

      dispatch({ type: 'FETCH_HOUSES_ERROR', payload: apiError });

      await analytics.track({
        name: 'houses_fetch_error',
        properties: {
          error: apiError.message,
          status: apiError.status,
          code: apiError.code,
          source: 'houses_context'
        }
      });
    }
  }, [apiService, analytics]);

  const fetchHouseById = useCallback(async (id: string) => {
    dispatch({ type: 'FETCH_HOUSE_START' });

    try {
      await analytics.track({
        name: 'house_detail_fetch_initiated',
        properties: { houseId: id, source: 'houses_context' }
      });

      const house = await apiService.getHouseById(id);
      
      dispatch({ type: 'FETCH_HOUSE_SUCCESS', payload: house });

      await analytics.track({
        name: 'house_detail_fetch_success',
        properties: { 
          houseId: id,
          houseName: house.name,
          source: 'houses_context'
        }
      });
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Failed to fetch house details',
        status: error && typeof error === 'object' && 'status' in error ? (error as { status: number }).status : undefined,
        code: error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : undefined,
      };

      dispatch({ type: 'FETCH_HOUSE_ERROR', payload: apiError });

      await analytics.track({
        name: 'house_detail_fetch_error',
        properties: {
          houseId: id,
          error: apiError.message,
          status: apiError.status,
          code: apiError.code,
          source: 'houses_context'
        }
      });
    }
  }, [apiService, analytics]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const clearSelectedHouse = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTED_HOUSE' });
  }, []);

  const contextValue: HousesContextType = {
    state,
    fetchHouses,
    fetchHouseById,
    clearError,
    clearSelectedHouse,
  };

  return (
    <HousesContext.Provider value={contextValue}>
      {children}
    </HousesContext.Provider>
  );
} 