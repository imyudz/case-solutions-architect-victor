import type { ApiError } from '../types/api';

interface ErrorMessageProps {
  error: ApiError;
  onRetry?: () => void;
  className?: string;
  showDetails?: boolean;
}

export function ErrorMessage({ 
  error, 
  onRetry, 
  className = '', 
  showDetails = false 
}: ErrorMessageProps) {
  const getErrorIcon = (status?: number) => {
    if (!status) return '🌩️';
    if (status >= 500) return '🔥';
    if (status === 404) return '🗺️';
    if (status >= 400) return '⚠️';
    return '❌';
  };

  const getErrorTitle = (status?: number) => {
    if (!status) return 'Connection Problem';
    if (status >= 500) return 'Server Spell Malfunction';
    if (status === 404) return 'House Not Found';
    if (status >= 400) return 'Invalid Request';
    return 'Something Went Wrong';
  };

  const getErrorDescription = (error: ApiError) => {
    if (!error.status) {
      return 'Unable to connect to the magical network. Please check your connection.';
    }
    if (error.status >= 500) {
      return 'Our magical servers are experiencing difficulties. Please try again in a moment.';
    }
    if (error.status === 404) {
      return 'The house you\'re looking for seems to have vanished from our records.';
    }
    if (error.status >= 400) {
      return 'There was an issue with your request. Please try again.';
    }
    return error.message || 'An unexpected error occurred while casting the spell.';
  };

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="glass rounded-magical p-8 text-center shadow-glass border border-red-200 border-opacity-30">
        <div className="text-6xl mb-6 animate-gentle-float">
          {getErrorIcon(error.status)}
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4 text-shadow-magical">
          {getErrorTitle(error.status)}
        </h3>
        
        <p className="text-white text-opacity-90 mb-6 leading-relaxed">
          {getErrorDescription(error)}
        </p>

        {showDetails && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-white text-opacity-70 hover:text-opacity-100 
                             font-medium mb-3 transition-colors duration-200">
              Technical Details
            </summary>
            <div className="bg-black bg-opacity-20 rounded-lg p-4 text-sm font-mono space-y-2">
              <div className="text-white text-opacity-80">
                <span className="text-white font-medium">Status:</span> {error.status || 'Network Error'}
              </div>
              <div className="text-white text-opacity-80">
                <span className="text-white font-medium">Code:</span> {error.code || 'UNKNOWN'}
              </div>
              <div className="text-white text-opacity-80">
                <span className="text-white font-medium">Message:</span> {error.message}
              </div>
            </div>
          </details>
        )}

        {onRetry && (
          <div className="flex justify-center">
            <button 
              onClick={onRetry}
              className="btn-secondary inline-flex items-center gap-2 text-lg font-medium
                       hover:bg-white hover:bg-opacity-20 focus-magical"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 