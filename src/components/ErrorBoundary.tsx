import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { serviceContainer } from '../services/container';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private analytics = serviceContainer.getAnalyticsService();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.analytics.track('ErrorBoundaryTriggered', {
      component_name: 'ErrorBoundary',
      error_message: error.message,
      stack_trace: error.stack || 'No stack trace available'
    });

    this.analytics.track('ErrorOccurred', {
      error_type: 'React Error Boundary',
      error_message: error.message,
      page_name: window.location.pathname,
      stack_trace: error.stack
    });

    this.setState({
      error,
      errorInfo
    });
    
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.analytics.track('ButtonClicked', {
      id: 'error_boundary_retry',
      label: 'Retry Application'
    });
    
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 bg-fixed flex items-center justify-center">
          <div className="container-responsive">
            <div className="text-center">
              <div className="glass-strong rounded-3xl p-12 max-w-lg mx-auto border border-white/20">
                <div className="text-6xl mb-6">🔮</div>
                <h1 className="heading-magical text-3xl text-white mb-6">
                  Something Magical Went Wrong
                </h1>
                <p className="text-white/80 mb-8 leading-relaxed">
                  It seems like a spell has gone awry! Even the best wizards encounter unexpected magic sometimes.
                </p>
                
                {import.meta.env.DEV && this.state.error && (
                  <div className="text-left bg-black/20 rounded-lg p-4 mb-6 text-sm text-white/70 max-h-40 overflow-y-auto">
                    <strong>Error:</strong> {this.state.error.message}
                    {this.state.error.stack && (
                      <pre className="mt-2 text-xs whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                )}
                
                <button 
                  onClick={this.handleRetry}
                  className="btn-magical btn-primary text-lg interactive shadow-lg 
                           hover:shadow-xl transition-all duration-300"
                >
                  Cast Repair Spell
                </button>
                
                <p className="text-white/60 text-sm mt-4">
                  This will reload the application
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 