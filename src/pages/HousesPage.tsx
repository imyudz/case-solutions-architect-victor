import { useEffect } from 'react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 bg-fixed flex items-center justify-center">
        <div className="container-responsive">
          <div className="text-center">
            <div className="glass-strong rounded-3xl p-12 max-w-md mx-auto border border-white/20">
              <div className="text-6xl mb-6 animate-bounce">🏰</div>
              <LoadingSpinner 
                size="large" 
                message="Summoning the Houses of Hogwarts..." 
              />
              <p className="text-white/70 mt-4 text-sm">
                Please wait while we gather the magical data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.error && state.houses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 bg-fixed flex items-center justify-center">
        <div className="container-responsive">
          <div className="text-center">
            <div className="glass-strong rounded-3xl p-12 max-w-lg mx-auto border border-white/20">
              <div className="text-6xl mb-6">⚡</div>
              <ErrorMessage 
                error={state.error} 
                onRetry={handleRetry}
                showDetails={import.meta.env.DEV}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 bg-fixed">
      <div className="content-grid min-h-screen">
        {/* Hero Section */}
        <header className="full-width relative py-16 sm:py-24 overflow-hidden">
          {/* Background with magical gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-violet-700/30 to-indigo-900/40"></div>
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="container-responsive text-center">
            <div className="glass-strong rounded-3xl p-8 sm:p-12 backdrop-blur-lg">
              <div className="flex justify-center items-center gap-4 mb-6">
                <span 
                  className="text-5xl sm:text-6xl lg:text-7xl animate-magical-glow filter drop-shadow-2xl"
                  style={{ animationDelay: '0ms' }}
                >
                  🏰
                </span>
                <span 
                  className="text-5xl sm:text-6xl lg:text-7xl animate-magical-glow filter drop-shadow-2xl"
                  style={{ animationDelay: '1500ms' }}
                >
                  🪄
                </span>
              </div>
              
              <h1 className="heading-magical text-4xl sm:text-5xl lg:text-7xl text-white mb-6 text-shadow-magical">
                Houses of Hogwarts
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto font-light">
                Discover the four noble houses of Hogwarts School of Witchcraft and Wizardry.
                <br className="hidden sm:block" />
                Each house has its own noble history and each has produced outstanding witches and wizards.
              </p>
              
              <div className="mt-8 flex justify-center">
                <div className="flex gap-3">
                  <div className="w-20 h-1.5 rounded-full shadow-lg" style={{ backgroundColor: '#D3343F' }}></div>
                  <div className="w-20 h-1.5 rounded-full shadow-lg" style={{ backgroundColor: '#1B7332' }}></div>
                  <div className="w-20 h-1.5 rounded-full shadow-lg" style={{ backgroundColor: '#F1C40F' }}></div>
                  <div className="w-20 h-1.5 rounded-full shadow-lg" style={{ backgroundColor: '#0066CC' }}></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-16 relative">
          {/* Loading Overlay */}
          {state.loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass-strong rounded-2xl p-8">
                <LoadingSpinner size="small" message="Updating magical data..." />
              </div>
            </div>
          )}

          <div className="container-responsive">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="heading-magical text-3xl sm:text-4xl text-white mb-4 text-shadow-crisp">
                Choose Your Destiny
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Click on any house to discover its unique characteristics, values, and notable members.
              </p>
            </div>

            {/* Empty State */}
            {state.houses.length === 0 && !state.loading && !state.error ? (
              <div className="text-center py-16">
                <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-6">🔮</div>
                  <h3 className="heading-magical text-2xl text-white mb-4">Magic Dormant</h3>
                  <p className="text-white/80 mb-8">
                    The houses seem to be hiding... Perhaps the Sorting Hat needs a moment?
                  </p>
                  <button 
                    onClick={handleRetry}
                    className="btn-magical btn-primary text-lg interactive shadow-lg 
                             hover:shadow-xl transition-all duration-300"
                  >
                    🔍 Search Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Houses Grid */}
                <div className="houses-grid mb-20">
                  {state.houses.map((house, index) => (
                    <div 
                      key={house.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <HouseCard house={house} />
                    </div>
                  ))}
                </div>

                {/* Enhanced Footer */}
                <footer className="text-center py-12">
                  <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
                    <div className="flex justify-center items-center gap-3 mb-4">
                      <span className="text-2xl animate-pulse-slow">✨</span>
                      <span className="text-2xl animate-pulse-slow" style={{ animationDelay: '1s' }}>🌟</span>
                      <span className="text-2xl animate-pulse-slow" style={{ animationDelay: '2s' }}>✨</span>
                    </div>
                    <p className="heading-magical text-xl text-white/90 mb-2">
                      May your journey through Hogwarts
                    </p>
                    <p className="text-white/80">
                      be filled with magic, friendship, and endless wonder
                    </p>
                  </div>
                </footer>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 