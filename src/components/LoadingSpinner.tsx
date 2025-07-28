
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          wand: 'w-8 h-8 text-2xl',
          sparkles: 'w-16 h-16',
          message: 'text-sm'
        };
      case 'large':
        return {
          container: 'p-12',
          wand: 'w-16 h-16 text-5xl',
          sparkles: 'w-32 h-32',
          message: 'text-xl'
        };
      default: // medium
        return {
          container: 'p-8',
          wand: 'w-12 h-12 text-4xl',
          sparkles: 'w-24 h-24',
          message: 'text-lg'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses.container} ${className}`}>
      {/* Main spinner container */}
      <div className="relative flex items-center justify-center">
        {/* Magic wand */}
        <div className={`${sizeClasses.wand} flex items-center justify-center animate-spin-wand`}>
          🪄
        </div>
        
        {/* Sparkles around the wand */}
        <div className={`absolute ${sizeClasses.sparkles} animate-gentle-float`}>
          {/* Sparkle 1 - top */}
          <span 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-pulse"
            style={{ animationDelay: '0s', animationDuration: '1.5s' }}
          >
            ✨
          </span>
          
          {/* Sparkle 2 - right */}
          <span 
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-purple-400 animate-pulse"
            style={{ animationDelay: '0.5s', animationDuration: '1.5s' }}
          >
            ⭐
          </span>
          
          {/* Sparkle 3 - bottom */}
          <span 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-blue-400 animate-pulse"
            style={{ animationDelay: '1s', animationDuration: '1.5s' }}
          >
            ✨
          </span>
          
          {/* Sparkle 4 - left */}
          <span 
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-pink-400 animate-pulse"
            style={{ animationDelay: '1.5s', animationDuration: '1.5s' }}
          >
            💫
          </span>
        </div>
        
        {/* Magical glow effect */}
        <div className="absolute inset-0 rounded-full bg-purple-400 bg-opacity-20 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-blue-400 bg-opacity-10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {/* Loading message */}
      {message && (
        <p className={`mt-6 text-center font-medium text-white text-opacity-90 ${sizeClasses.message} animate-pulse`}>
          {message}
        </p>
      )}
    </div>
  );
} 