import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHouses } from '../hooks/useHouses';
import { useAnalytics } from '../hooks/useAnalytics';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmailCapture } from '../components/EmailCapture';

export function HouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, fetchHouseById, clearSelectedHouse } = useHouses();
  const { trackButtonClick } = useAnalytics();

  useEffect(() => {
    if (!id) {
      navigate('/houses');
      return;
    }

    fetchHouseById(id);

    return () => {
      clearSelectedHouse();
    };
  }, [id, fetchHouseById, clearSelectedHouse, navigate]);

  const handleRetry = () => {
    if (!id) return;
    
    trackButtonClick('retry_button', 'Retry');
    fetchHouseById(id);
  };

  const handleBackToHouses = () => {
    trackButtonClick('back_to_houses_button', 'Back to Houses');
    navigate('/houses');
  };

  const getHouseColors = (colors: string | null) => {
    if (!colors) return ['#6c757d', '#6c757d'];
    
    const colorMap: Record<string, string> = {
      'red': '#dc3545',
      'gold': '#ffd700',
      'yellow': '#ffc107',
      'green': '#28a745',
      'silver': '#c0c0c0',
      'blue': '#007bff',
      'bronze': '#cd7f32',
      'black': '#343a40',
      'scarlet': '#ff2400',
      'emerald': '#50c878'
    };

    const colorPairs = colors.toLowerCase().split(' and ').map(color => 
      colorMap[color.trim()] || '#6c757d'
    );

    return colorPairs.length >= 2 ? colorPairs.slice(0, 2) : [colorPairs[0], colorPairs[0]];
  };

  const getAnimalEmoji = (animal: string | null) => {
    const animalMap: Record<string, string> = {
      'lion': '🦁',
      'snake': '🐍',
      'eagle': '🦅',
      'badger': '🦡',
      'raven': '🐦‍⬛'
    };

    return animal ? animalMap[animal.toLowerCase()] || '🐾' : '🐾';
  };

  const getElementEmoji = (element: string | null) => {
    const elementIcons: Record<string, string> = {
      'fire': '🔥',
      'earth': '🌱',
      'air': '💨',
      'water': '🌊'
    };

    return element ? elementIcons[element.toLowerCase()] || '⭐' : '⭐';
  };

  if (state.loading) {
    return (
      <div className="min-h-screen py-8 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #504a74 0%, #181625 100%)'
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <LoadingSpinner 
            size="large" 
            message="Revealing the secrets of the house..." 
          />
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen py-8 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #504a74 0%, #181625 100%)'
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <button 
              onClick={handleBackToHouses}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl
                       bg-black/40 backdrop-blur-md border border-white/20
                       text-white font-medium hover:bg-black/60 hover:border-white/30
                       transition-all duration-300 group cursor-pointer"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Houses
            </button>
          </div>
          <ErrorMessage 
            error={state.error} 
            onRetry={handleRetry}
            showDetails={import.meta.env.DEV}
          />
        </div>
      </div>
    );
  }

  if (!state.selectedHouse) {
    return (
      <div className="min-h-screen py-8 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #504a74 0%, #181625 100%)'
      }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <button 
              onClick={handleBackToHouses}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl
                       bg-black/40 backdrop-blur-md border border-white/20
                       text-white font-medium hover:bg-black/60 hover:border-white/30
                       transition-all duration-300 group cursor-pointer"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Houses
            </button>
          </div>
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🏰</div>
            <h1 className="text-3xl font-bold text-white mb-4">House Not Found</h1>
            <p className="text-lg text-white text-opacity-80">
              The house you're looking for seems to have vanished into thin air!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const house = state.selectedHouse;
  const [primaryColor, secondaryColor] = getHouseColors(house.houseColours);

  const getHouseBackground = (houseName: string | null) => {
    const name = houseName?.toLowerCase();
    if (name?.includes('gryffindor')) return '/src/assets/Gryffindor.svg';
    if (name?.includes('slytherin')) return '/src/assets/Slytherin.svg';
    if (name?.includes('hufflepuff')) return '/src/assets/Hufflepuff.svg';
    if (name?.includes('ravenclaw')) return '/src/assets/Ravenclaw.svg';
    return null;
  };

  const getHouseGradient = (houseName: string | null) => {
    const name = houseName?.toLowerCase();
    if (name?.includes('gryffindor')) return 'linear-gradient(135deg, #7c2d2d 0%, #b8860b 100%)';
    if (name?.includes('slytherin')) return 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 100%)';
    if (name?.includes('hufflepuff')) return 'linear-gradient(135deg, #b8860b 0%, #2c1810 100%)';
    if (name?.includes('ravenclaw')) return 'linear-gradient(135deg, #1e3a8a 0%, #374151 100%)';
    return 'linear-gradient(135deg, #504a74 0%, #181625 100%)';
  };

  const houseBackground = getHouseBackground(house.name);
  const houseGradient = getHouseGradient(house.name);

  return (
    <div 
      className="min-h-screen py-8 relative overflow-hidden"
      style={{
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
        background: houseGradient
      } as React.CSSProperties}
    >
      {houseBackground && (
        <div className="absolute inset-0 opacity-20">
          <img 
            src={houseBackground} 
            alt="" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
      
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={handleBackToHouses}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl
                     bg-black/40 backdrop-blur-md border border-white/20
                     text-white font-medium hover:bg-black/60 hover:border-white/30
                     transition-all duration-300 group cursor-pointer"
          >
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Houses
          </button>
        </div>

        <main className="space-y-8">
          <header className="text-center glass rounded-magical p-8 shadow-glass">
            <div className="flex justify-center items-center gap-6 mb-6">
              <span className="text-6xl md:text-7xl animate-gentle-float filter drop-shadow-lg">
                {getAnimalEmoji(house.animal)}
              </span>
              <span 
                className="text-6xl md:text-7xl animate-gentle-float filter drop-shadow-lg"
                style={{ animationDelay: '1.5s' }}
              >
                {getElementEmoji(house.element)}
              </span>
            </div>
            
            <div className="flex justify-center gap-2 mb-6">
              <div 
                className="w-20 h-4 rounded-full shadow-inner"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div 
                className="w-20 h-4 rounded-full shadow-inner"
                style={{ backgroundColor: secondaryColor }}
              ></div>
            </div>

            <h1 className="font-magical text-4xl md:text-5xl lg:text-6xl text-white text-shadow-magical">
              {house.name || 'Unknown House'}
            </h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="glass rounded-magical p-6 shadow-glass">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                🏛️ Foundation
              </h2>
              <div className="space-y-4">
                {house.founder && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-white text-opacity-90 min-w-20">Founder:</span>
                    <span className="text-white">{house.founder}</span>
                  </div>
                )}
                {house.element && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-white text-opacity-90 min-w-20">Element:</span>
                    <span className="text-white flex items-center gap-2">
                      {getElementEmoji(house.element)} {house.element}
                    </span>
                  </div>
                )}
                {house.animal && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-white text-opacity-90 min-w-20">Animal:</span>
                    <span className="text-white flex items-center gap-2">
                      {getAnimalEmoji(house.animal)} {house.animal}
                    </span>
                  </div>
                )}
                {house.houseColours && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-white text-opacity-90 min-w-20">Colors:</span>
                    <span className="text-white">{house.houseColours}</span>
                  </div>
                )}
              </div>
            </section>

            <section className="glass rounded-magical p-6 shadow-glass">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                🏰 House Details
              </h2>
              <div className="space-y-4">
                {house.commonRoom && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-white text-opacity-90 min-w-28">Common Room:</span>
                    <span className="text-white">{house.commonRoom}</span>
                  </div>
                )}
                {house.ghost && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="font-medium text-white text-opacity-90 min-w-28">House Ghost:</span>
                    <span className="text-white flex items-center gap-2">
                      👻 {house.ghost}
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {house.traits && house.traits.length > 0 && (
            <section className="glass rounded-magical p-6 shadow-glass">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                ✨ House Traits
              </h2>
              <div className="flex flex-wrap gap-3">
                {house.traits.map((trait) => (
                  <div 
                    key={trait.id} 
                    className="--primary-color bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 
                             rounded-full border border-white border-opacity-30 
                             hover:bg-opacity-30 transition-all duration-300"
                  >
                    {typeof trait.name === 'string' ? trait.name : ''}
                  </div>
                ))}
              </div>
            </section>
          )}

          {house.heads && house.heads.length > 0 && (
            <section className="glass rounded-magical p-6 shadow-glass">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                👨‍🏫 House Heads
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {house.heads.map((head) => (
                  <div 
                    key={head.id}
                    className="--primary-color bg-opacity-10 backdrop-blur-sm text-white p-4 
                             rounded-xl border border-white border-opacity-20
                             hover:bg-opacity-20 transition-all duration-300"
                  >
                    <span className="font-medium">
                      {head.firstName} {head.lastName}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <EmailCapture 
            houseName={house.name || 'Unknown House'}
            houseId={id}
            className="mt-8"
          />
        </main>
      </div>
    </div>
  );
} 