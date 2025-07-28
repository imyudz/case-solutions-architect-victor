import React, { useEffect } from 'react';
import { useHouses } from '../hooks/useHouses';
import { HouseCard } from '../components/HouseCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { serviceContainer } from '../services/container';

export function HousesPage() {
  const { state, fetchHouses } = useHouses();
  const analytics = serviceContainer.getAnalyticsService();

  useEffect(() => {
    analytics.track({
      name: 'page_view',
      properties: {
        page: 'houses_list',
        path: '/houses'
      }
    });

    // Fetch houses if not already loaded
    if (state.houses.length === 0 && !state.loading && !state.error) {
      fetchHouses();
    }
  }, [fetchHouses, state.houses.length, state.loading, state.error, analytics]);

  const handleRetry = () => {
    analytics.track({
      name: 'retry_button_clicked',
      properties: {
        page: 'houses_list',
        errorType: state.error?.code || 'unknown'
      }
    });
    fetchHouses();
  };

  if (state.loading && state.houses.length === 0) {
    return (
      <div className="min-h-screen bg-magic-gradient bg-fixed py-8">
        <div className="max-w-6xl mx-auto px-4">
          <LoadingSpinner 
            size="large" 
            message="Summoning the Houses of Hogwarts..." 
          />
        </div>
      </div>
    );
  }

  if (state.error && state.houses.length === 0) {
    return (
      <div className="min-h-screen bg-magic-gradient bg-fixed py-8">
        <div className="max-w-6xl mx-auto px-4">
          <ErrorMessage 
            error={state.error} 
            onRetry={handleRetry}
            showDetails={import.meta.env.DEV}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-magic-gradient bg-fixed py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12 p-8 glass rounded-magical shadow-glass">
          <h1 className="font-magical text-3xl sm:text-4xl lg:text-5xl text-white mb-4 text-shadow-magical">
            <span className="text-4xl sm:text-5xl lg:text-6xl animate-magical-glow mr-4">🏰</span>
            Houses of Hogwarts
            <span className="text-4xl sm:text-5xl lg:text-6xl animate-magical-glow ml-4" style={{animationDelay: '1.5s'}}>🪄</span>
          </h1>
          <p className="text-lg sm:text-xl text-white text-opacity-90 leading-relaxed max-w-2xl mx-auto italic">
            Discover the four noble houses of Hogwarts School of Witchcraft and Wizardry.
            Each house has its own noble history and each has produced outstanding witches and wizards.
          </p>
        </header>

        {/* Main Content */}
        <main className="relative">
          {/* Loading Overlay */}
          {state.loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-modal">
              <LoadingSpinner size="small" message="Updating..." />
            </div>
          )}

          {/* Empty State */}
          {state.houses.length === 0 && !state.loading && !state.error ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📚</div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">No Houses Found</h2>
              <p className="text-lg text-white text-opacity-80 mb-8 max-w-md mx-auto">
                It seems the Sorting Hat has taken all the houses for a walk. 
                Please try again later.
              </p>
              <button 
                onClick={handleRetry}
                className="btn-secondary text-lg"
              >
                🔍 Search Again
              </button>
            </div>
          ) : (
            <>
              {/* Houses Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
                {state.houses.map((house, index) => (
                  <div 
                    key={house.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    <HouseCard house={house} />
                  </div>
                ))}
              </div>

              {/* Footer */}
              {state.houses.length > 0 && (
                <footer className="text-center py-8">
                  <p className="text-lg text-white text-opacity-90 font-medium">
                    ✨ May your journey through Hogwarts be filled with magic and wonder ✨
                  </p>
                </footer>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
} 