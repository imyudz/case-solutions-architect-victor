import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHouses } from '../hooks/useHouses';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { serviceContainer } from '../services/container';

export function HouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, fetchHouseById, clearSelectedHouse } = useHouses();
  const analytics = serviceContainer.getAnalyticsService();

  useEffect(() => {
    if (!id) {
      navigate('/houses');
      return;
    }

    analytics.track('PageView', {
      page_name: 'house_detail',
      path: `/house/${id}`
    });

    fetchHouseById(id);

    return () => {
      clearSelectedHouse();
    };
  }, [id, fetchHouseById, clearSelectedHouse, navigate, analytics]);

  const handleRetry = () => {
    if (!id) return;
    
    analytics.track('ButtonClicked', {
      id: 'retry_button',
      label: 'Retry'
    });
    fetchHouseById(id);
  };

  const handleBackToHouses = () => {
    analytics.track('ButtonClicked', {
      id: 'back_to_houses_button',
      label: 'Back to Houses'
    });
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
      <div className="min-h-screen bg-magic-gradient bg-fixed py-8">
        <div className="max-w-6xl mx-auto px-4">
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
      <div className="min-h-screen bg-magic-gradient bg-fixed py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <button 
              onClick={handleBackToHouses}
              className="btn-secondary inline-flex items-center gap-2"
            >
              ← Back to Houses
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
      <div className="min-h-screen bg-magic-gradient bg-fixed py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <button 
              onClick={handleBackToHouses}
              className="btn-secondary inline-flex items-center gap-2"
            >
              ← Back to Houses
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

  return (
    <div 
      className="min-h-screen bg-magic-gradient bg-fixed py-8"
      style={{
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor
      } as React.CSSProperties}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-8">
          <button 
            onClick={handleBackToHouses}
            className="btn-secondary inline-flex items-center gap-2"
          >
            ← Back to Houses
          </button>
        </div>

        {/* Main content */}
        <main className="space-y-8">
          {/* Header */}
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
            
            {/* Color stripes */}
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

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Foundation section */}
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

            {/* House details section */}
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

          {/* Traits section */}
          {house.traits && house.traits.length > 0 && (
            <section className="glass rounded-magical p-6 shadow-glass">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                ✨ House Traits
              </h2>
              <div className="flex flex-wrap gap-3">
                {house.traits.map((trait) => (
                  <div 
                    key={trait.id} 
                    className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 
                             rounded-full border border-white border-opacity-30 
                             hover:bg-opacity-30 transition-all duration-300"
                  >
                    {typeof trait.name === 'string' ? trait.name : ''}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* House heads section */}
          {house.heads && house.heads.length > 0 && (
            <section className="glass rounded-magical p-6 shadow-glass">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                👨‍🏫 House Heads
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {house.heads.map((head) => (
                  <div 
                    key={head.id}
                    className="bg-white bg-opacity-10 backdrop-blur-sm text-white p-4 
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
        </main>
      </div>
    </div>
  );
} 