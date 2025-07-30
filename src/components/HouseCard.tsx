import { Link } from 'react-router-dom';
import type { HouseDto } from '../types/api';
import { useAnalytics } from '../hooks/useAnalytics';

interface HouseCardProps {
  house: HouseDto;
  className?: string;
}

export function HouseCard({ house, className = '' }: HouseCardProps) {
  const { trackButtonClick, trackHouseCardHover, trackTraitClick } = useAnalytics();

  const handleCardClick = () => {
    trackButtonClick('house_card_clicked', 'Explore House');
  };

  const handleMouseEnter = () => {
    return trackHouseCardHover(house.id, house.name || undefined);
  };

  const handleTraitClick = (traitName: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    trackTraitClick(traitName, house.id, house.name || undefined);
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

  const getHouseBackground = (houseName: string | null) => {
    const name = houseName?.toLowerCase();
    if (name?.includes('gryffindor')) return 'public/GryffindorCard.svg';
    if (name?.includes('slytherin')) return 'public/SlytherinCard.svg';
    if (name?.includes('hufflepuff')) return 'public/HufflepuffCard.svg';
    if (name?.includes('ravenclaw')) return 'public/RavenclawCard.svg';
    return null;
  };

  const [primaryColor, secondaryColor] = getHouseColors(house.houseColours);
  const houseBackground = getHouseBackground(house.name);

  return (
    <Link 
      to={`/house/${house.id}`} 
      className={`block w-full text-inherit no-underline ${className}`}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
    >
      <article 
        className={`group relative card-magical card-house hover-lift interactive
                   h-[520px] flex flex-col overflow-hidden
                   focus-ring bg-gray-800`}
        style={{
          '--house-primary': primaryColor,
          '--house-secondary': secondaryColor,
          backgroundImage: houseBackground ? `url('${houseBackground}')` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/50"></div>
        <div className="relative z-10 p-6 bg-gradient-to-br from-var(--house-primary)/25 to-var(--house-secondary)/15 
                        border-b border-var(--house-primary)/30 backdrop-blur-sm">
          <h2 className="heading-magical text-xl md:text-2xl text-white 
                         text-shadow-crisp mb-0 line-clamp-1 font-bold">
            {house.name || 'Unknown House'}
          </h2>
        </div>

        <div className="relative z-10 flex-1 p-6 pt-4 flex flex-col bg-gradient-to-b from-transparent to-black/20">
          <div className="space-y-4 flex-1">
            {house.founder && (
              <div className="group/info">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-white/90 font-medium text-xs uppercase tracking-wider bg-black/30 px-2 py-1 rounded text-opacity-90">Founded by</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-var(--house-primary)/30 to-transparent"></div>
                </div>
                <p className="text-sm font-semibold text-white mt-1 
                            group-hover/info:text-var(--house-primary) transition-colors duration-200 line-clamp-1">
                  {house.founder}
                </p>
              </div>
            )}

            {house.element && (
              <div className="group/info">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-white/90 font-medium text-xs uppercase tracking-wider bg-black/30 px-2 py-1 rounded text-opacity-90">Element</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-var(--house-primary)/30 to-transparent"></div>
                </div>
                <p className="text-sm font-semibold text-white mt-1 capitalize
                            group-hover/info:text-var(--house-primary) transition-colors duration-200">
                  {house.element}
                </p>
              </div>
            )}
          </div>

          {house.traits && house.traits.length > 0 && (
            <div className="group/info mt-6 pt-4 border-t border-var(--house-primary)/30">
              <div className="flex items-center gap-2 text-sm mb-4">
                <span className="text-white/90 font-medium text-xs uppercase tracking-wider bg-black/30 px-2 py-1 rounded text-opacity-90">House Traits</span>
                <div className="flex-1 h-px bg-gradient-to-r from-var(--house-primary)/30 to-transparent"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {house.traits.slice(0, 4).map((trait) => (
                  <span 
                    key={trait.id} 
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium
                             bg-var(--house-primary)/25 text-white border border-var(--house-primary)/50
                             hover:bg-var(--house-primary)/35 hover:scale-105
                             transition-all duration-200 cursor-pointer backdrop-blur-sm"
                    onClick={(event) => handleTraitClick(typeof trait.name === 'string' ? trait.name : '', event)}
                  >
                    {typeof trait.name === 'string' ? trait.name : ''}
                  </span>
                ))}
                {house.traits.length > 4 && (
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium
                                 bg-white/20 text-white/90 border border-white/40 backdrop-blur-sm
                                 cursor-default">
                    +{house.traits.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r 
                        from-transparent via-white/20 to-transparent 
                        transform -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-1000 ease-out">
          </div>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-var(--house-primary)/20 to-var(--house-secondary)/20 
                        blur-xl transform scale-105">
          </div>
        </div>
      </article>
    </Link>
  );
}
