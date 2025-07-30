import { Link } from 'react-router-dom';
import type { HouseDto } from '../types/api';
import { serviceContainer } from '../services/container';

interface HouseCardProps {
  house: HouseDto;
  className?: string;
}

export function HouseCard({ house, className = '' }: HouseCardProps) {
  const analytics = serviceContainer.getAnalyticsService();

  const handleCardClick = () => {
    analytics.track({
      name: 'house_card_clicked',
      properties: {
        houseId: house.id,
        houseName: house.name,
        source: 'house_list'
      }
    });
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

  const getHouseElement = (element: string | null) => {
    const elementIcons: Record<string, string> = {
      'fire': '🔥',
      'earth': '🌱',
      'air': '💨',
      'water': '🌊'
    };

    return element ? elementIcons[element.toLowerCase()] || '⭐' : '⭐';
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

  const getHouseGradient = (houseName: string | null) => {
    const name = houseName?.toLowerCase();
    if (name?.includes('gryffindor')) return 'bg-gryffindor-gradient';
    if (name?.includes('slytherin')) return 'bg-slytherin-gradient';
    if (name?.includes('hufflepuff')) return 'bg-hufflepuff-gradient';
    if (name?.includes('ravenclaw')) return 'bg-ravenclaw-gradient';
    return 'bg-magic-gradient';
  };

  const [primaryColor, secondaryColor] = getHouseColors(house.houseColours);

  return (
    <Link 
      to={`/house/${house.id}`} 
      className={`block w-full text-inherit no-underline ${className}`}
      onClick={handleCardClick}
    >
      <article 
        className="group relative card-magical card-house hover-lift interactive
                   h-full min-h-[420px] flex flex-col overflow-hidden
                   focus-ring"
        style={{
          '--house-primary': primaryColor,
          '--house-secondary': secondaryColor
        } as React.CSSProperties}
      >
        {/* Modern Header */}
        <div className="relative p-6 bg-gradient-to-br from-var(--house-primary)/20 to-var(--house-secondary)/10 
                        border-b border-var(--house-primary)/20">
          <div className="flex justify-between items-center mb-4">
            {/* House symbols with enhanced animations */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-4xl md:text-5xl animate-gentle-float filter drop-shadow-2xl 
                               transition-transform duration-300 group-hover:scale-110">
                  {getAnimalEmoji(house.animal)}
                </span>
                <div className="absolute inset-0 animate-magical-glow opacity-30 blur-sm">
                  {getAnimalEmoji(house.animal)}
                </div>
              </div>
              <div className="relative">
                <span 
                  className="text-4xl md:text-5xl animate-gentle-float filter drop-shadow-2xl
                           transition-transform duration-300 group-hover:scale-110"
                  style={{ animationDelay: '1.5s' }}
                >
                  {getHouseElement(house.element)}
                </span>
                <div className="absolute inset-0 animate-magical-glow opacity-30 blur-sm" 
                     style={{ animationDelay: '1.5s' }}>
                  {getHouseElement(house.element)}
                </div>
              </div>
            </div>
            
            {/* Modern color indicators */}
            <div className="flex gap-2">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white/50 shadow-lg
                          transition-transform duration-300 group-hover:scale-125"
                style={{ backgroundColor: primaryColor }}
              ></div>
              <div 
                className="w-4 h-4 rounded-full border-2 border-white/50 shadow-lg
                          transition-transform duration-300 group-hover:scale-125"
                style={{ backgroundColor: secondaryColor }}
              ></div>
            </div>
          </div>
          
          {/* House name with modern typography */}
          <h2 className="heading-magical text-2xl md:text-3xl text-var(--color-text-primary) 
                         text-shadow-crisp mb-2 line-clamp-1">
            {house.name || 'Unknown House'}
          </h2>
        </div>

        {/* Modern Content */}
        <div className="flex-1 p-6 flex flex-col justify-between min-h-[160px]">
          <div className="space-y-3">
            {house.founder && (
              <div className="group/info">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-var(--color-text-tertiary) font-medium">Founded by</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-var(--house-primary)/20 to-transparent"></div>
                </div>
                <p className="text-sm font-medium text-var(--color-text-primary) mt-1 
                            group-hover/info:text-var(--house-primary) transition-colors duration-200 line-clamp-1">
                  {house.founder}
                </p>
              </div>
            )}

            {house.element && (
              <div className="group/info">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-var(--color-text-tertiary) font-medium">Element</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-var(--house-primary)/20 to-transparent"></div>
                </div>
                <p className="text-sm font-medium text-var(--color-text-primary) mt-1 capitalize
                            group-hover/info:text-var(--house-primary) transition-colors duration-200">
                  {house.element}
                </p>
              </div>
            )}
          </div>

          {house.traits && house.traits.length > 0 && (
            <div className="group/info mt-4">
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className="text-var(--color-text-tertiary) font-medium">House Traits</span>
                <div className="flex-1 h-px bg-gradient-to-r from-var(--house-primary)/20 to-transparent"></div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {house.traits.slice(0, 2).map((trait) => (
                  <span 
                    key={trait.id} 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                             bg-var(--house-primary)/10 text-var(--house-primary) 
                             border border-var(--house-primary)/20
                             hover:bg-var(--house-primary)/20 hover:scale-105
                             transition-all duration-200 cursor-default"
                  >
                    {typeof trait.name === 'string' ? trait.name : ''}
                  </span>
                ))}
                {house.traits.length > 2 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                                 bg-var(--color-surface-tertiary) text-var(--color-text-secondary) 
                                 border border-var(--color-border)
                                 cursor-default">
                    +{house.traits.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modern Footer */}
        <div className="p-6 pt-3 mt-auto">
          <div className="flex items-center justify-between p-4 rounded-xl 
                        bg-gradient-to-r from-var(--house-primary)/5 to-var(--house-secondary)/5
                        border border-var(--house-primary)/10
                        group-hover:from-var(--house-primary)/10 group-hover:to-var(--house-secondary)/10
                        transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-var(--house-primary)/20 
                            flex items-center justify-center
                            group-hover:bg-var(--house-primary)/30 
                            transition-all duration-300 group-hover:scale-110">
                <span className="text-sm">🏰</span>
              </div>
              <span className="text-sm font-medium text-var(--color-text-secondary)
                             group-hover:text-var(--house-primary) transition-colors duration-300">
                Explore House
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-var(--house-primary)
                          transform group-hover:translate-x-1 transition-transform duration-300">
              <span className="w-1 h-1 rounded-full bg-current opacity-60"></span>
              <span className="w-2 h-1 rounded-full bg-current opacity-80"></span>
              <span className="w-3 h-1 rounded-full bg-current"></span>
            </div>
          </div>
        </div>

        {/* Enhanced shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r 
                        from-transparent via-white/10 via-white/20 via-white/10 to-transparent 
                        transform -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-1000 ease-out">
          </div>
        </div>

        {/* Magical glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-var(--house-primary)/20 to-var(--house-secondary)/20 
                        blur-xl transform scale-105">
          </div>
        </div>
      </article>
    </Link>
  );
}
