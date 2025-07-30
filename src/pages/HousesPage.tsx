import { useEffect } from 'react';
import { useHouses } from '../hooks/useHouses';
import { useAnalytics } from '../hooks/useAnalytics';
import { HouseCard } from '../components/HouseCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function HousesPage() {
  const { state, fetchHouses } = useHouses();
  const { trackButtonClick } = useAnalytics();

  useEffect(() => {
    if (state.houses.length === 0 && !state.loading && !state.error) {
      fetchHouses();
    }
  }, [fetchHouses, state.houses.length, state.loading, state.error]);

  const handleRetry = () => {
    trackButtonClick('retry_button', 'Retry');
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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #504a74 0%, #181625 100%)'
    }}>
      <div className="absolute inset-0 opacity-30">
        <img 
          src="public/background_main.svg" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="min-h-screen relative z-20">
        <div className="flex justify-center gap-3 pt-0 mb-8">
          <img src="public/house_g.svg" alt="Gryffindor" className="h-25 object-contain drop-shadow-lg" />
          <img src="public/house_r.svg" alt="Ravenclaw" className="h-25 object-contain drop-shadow-lg" />
          <img src="public/house_h.svg" alt="Hufflepuff" className="h-25 object-contain drop-shadow-lg" />
          <img src="public/house_s.svg" alt="Slytherin" className="h-25 object-contain drop-shadow-lg" />
        </div>

        <header className="relative py-5 overflow-hidden">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="glass-strong rounded-3xl p-4 sm:p-8 backdrop-blur-lg border border-white/10">
              <div className="flex justify-center items-center gap-3 mb-4">
                <span className="text-3xl sm:text-4xl animate-gentle-float filter drop-shadow-lg">🏰</span>
              </div>
              
              <h1 className="heading-magical text-3xl sm:text-4xl lg:text-5xl text-white mb-4 text-shadow-magical">
                Houses of Hogwarts
              </h1>
              
              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto font-light mb-4">
                Discover the four noble houses of Hogwarts School of Witchcraft and Wizardry.
                <br className="hidden sm:block" />
                Each house has its own noble history and each has produced outstanding witches and wizards.
              </p>
            </div>
          </div>
        </header>

        <main className="py-8 relative">
          {state.loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass-strong rounded-2xl p-8">
                <LoadingSpinner size="small" message="Updating magical data..." />
              </div>
            </div>
          )}

          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="heading-magical text-2xl sm:text-3xl text-white mb-3 text-shadow-crisp">
                Choose Your Destiny
              </h2>
              <p className="text-base text-white/80 max-w-xl mx-auto">
                Click on any house to discover its unique characteristics, values, and notable members.
              </p>
            </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
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

                <footer className="text-center py-6">
                  <div className="glass rounded-2xl p-4 max-w-lg mx-auto">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <span className="text-lg animate-pulse-slow">✨</span>
                      <span className="text-lg animate-pulse-slow" style={{ animationDelay: '1s' }}>🌟</span>
                      <span className="text-lg animate-pulse-slow" style={{ animationDelay: '2s' }}>✨</span>
                    </div>
                    <p className="heading-magical text-base text-white/90 mb-1">
                      May your journey through Hogwarts
                    </p>
                    <p className="text-xs text-white/80">
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