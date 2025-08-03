import React from 'react'
import AppRouter from './components/Router'
import ErrorBoundary from './components/ErrorBoundary'
import { ENV_CONFIG } from './config/environment'

const App = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        {/* Global styles and meta information can be added here */}
        <AppRouter />
        
        {/* Footer with dynamic app info */}
        {ENV_CONFIG.DEBUG_MODE && (
          <div className="fixed bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded-tl-lg">
            {ENV_CONFIG.APP_NAME} v{ENV_CONFIG.VERSION} ({ENV_CONFIG.ENVIRONMENT})
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
