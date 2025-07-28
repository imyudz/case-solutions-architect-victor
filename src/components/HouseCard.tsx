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
        className="group relative bg-white bg-opacity-90 backdrop-blur-sm rounded-xl2 overflow-hidden
                   shadow-glass border border-white border-opacity-20 
                   transition-all duration-500 ease-out
                   hover:-translate-y-2 hover:shadow-magic 
                   cursor-pointer h-full flex flex-col"
        style={{
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor
        } as React.CSSProperties}
      >
        {/* Header with house colors */}
        <div 
          className={`relative ${getHouseGradient(house.name)} p-6 flex justify-between items-center min-h-20`}
        >
          {/* House symbols */}
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl animate-gentle-float filter drop-shadow-lg">
              {getAnimalEmoji(house.animal)}
            </span>
            <span 
              className="text-3xl md:text-4xl animate-gentle-float filter drop-shadow-lg"
              style={{ animationDelay: '1.5s' }}
            >
              {getHouseElement(house.element)}
            </span>
          </div>
          
          {/* Color stripes */}
          <div className="flex flex-col gap-1 w-15 h-10">
            <div 
              className="flex-1 rounded-full shadow-inner"
              style={{ backgroundColor: primaryColor }}
            ></div>
            <div 
              className="flex-1 rounded-full shadow-inner"
              style={{ backgroundColor: secondaryColor }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-magic-800 mb-2">
            {house.name || 'Unknown House'}
          </h2>
          
          {house.founder && (
            <div className="text-sm text-magic-600">
              <span className="font-medium text-magic-700">Founded by:</span>
              <span className="ml-2">{house.founder}</span>
            </div>
          )}

          {house.element && (
            <div className="text-sm text-magic-600">
              <span className="font-medium text-magic-700">Element:</span>
              <span className="ml-2 capitalize">{house.element}</span>
            </div>
          )}

          {house.traits && house.traits.length > 0 && (
            <div className="text-sm text-magic-600">
              <span className="font-medium text-magic-700 block mb-1">Traits:</span>
              <div className="flex flex-wrap gap-1">
                {house.traits.slice(0, 3).map((trait) => (
                  <span 
                    key={trait.id} 
                    className="inline-block bg-magic-100 text-magic-700 px-2 py-1 rounded-full text-xs"
                  >
                    {typeof trait.name === 'string' ? trait.name : ''}
                  </span>
                ))}
                {house.traits.length > 3 && (
                  <span className="inline-block bg-magic-200 text-magic-600 px-2 py-1 rounded-full text-xs">
                    +{house.traits.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-magic-600 font-medium 
                           group-hover:text-magic-800 transition-colors duration-300">
              Learn More 
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          </div>
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent 
                          transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
          </div>
        </div>
      </article>
    </Link>
  );
}
