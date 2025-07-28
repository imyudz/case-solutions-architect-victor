import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { serviceContainer } from '../services/container';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private analytics = serviceContainer.getAnalyticsService();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to analytics
    this.analytics.track({
      name: 'react_error_boundary_triggered',
      properties: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundary: 'ErrorBoundary',
      },
    });

    // Log to console in development
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    this.analytics.track({
      name: 'error_boundary_retry_clicked',
      properties: {
        previousError: this.state.error?.message,
      },
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-magic-gradient bg-fixed flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="glass rounded-magical p-8 text-center shadow-glass border border-red-200 border-opacity-30">
              {/* Error icon */}
              <div className="text-6xl mb-6 animate-gentle-float">🔮</div>
              
              {/* Error title */}
              <h1 className="text-3xl font-bold text-white mb-4 text-shadow-magical">
                Oops! Something went wrong
              </h1>
              
              {/* Error message */}
              <p className="text-lg text-white text-opacity-90 mb-8 leading-relaxed">
                It seems our magic has encountered an unexpected spell. Don't worry, we're on it!
              </p>
              
              {/* Error details for development */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-white text-opacity-70 hover:text-opacity-100 
                                   font-medium mb-3 transition-colors duration-200">
                    Error Details (Development)
                  </summary>
                  <pre className="bg-black bg-opacity-30 rounded-lg p-4 text-sm font-mono 
                                 text-white text-opacity-80 overflow-auto max-h-40 
                                 border border-white border-opacity-20">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={this.handleRetry}
                  className="btn-primary flex-1 sm:flex-none"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-secondary flex-1 sm:flex-none"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 