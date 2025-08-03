import React from 'react';
import { ENV_CONFIG } from '../config/environment';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to console in development
    if (ENV_CONFIG.DEBUG_MODE) {
      console.error('EventBooker Error Boundary caught an error:', error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    if (ENV_CONFIG.ENVIRONMENT === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-6xl mb-4">💥</div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-red-600 mb-6">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            
            {ENV_CONFIG.DEBUG_MODE && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Error Details (Debug Mode)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                  <div className="font-bold text-red-700 mb-2">Error:</div>
                  <div className="mb-3">{this.state.error && this.state.error.toString()}</div>
                  
                  <div className="font-bold text-red-700 mb-2">Stack Trace:</div>
                  <div>{this.state.errorInfo.componentStack}</div>
                </div>
              </details>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Go to Homepage
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full text-gray-600 py-2 px-4 hover:text-gray-800 transition-colors text-sm"
              >
                Reload Page
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {ENV_CONFIG.APP_NAME} v{ENV_CONFIG.VERSION}
              </p>
              {ENV_CONFIG.DEBUG_MODE && (
                <p className="text-xs text-gray-400 mt-1">
                  Environment: {ENV_CONFIG.ENVIRONMENT}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Render children normally when there's no error
    return this.props.children;
  }
}

export default ErrorBoundary;