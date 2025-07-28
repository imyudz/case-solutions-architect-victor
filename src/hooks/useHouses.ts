import { useContext } from 'react';
import { HousesContext, type HousesContextType } from '../context/houses-context';

// Custom hook to use the context
export function useHouses(): HousesContextType {
  const context = useContext(HousesContext);
  if (context === undefined) {
    throw new Error('useHouses must be used within a HousesProvider');
  }
  return context;
} 