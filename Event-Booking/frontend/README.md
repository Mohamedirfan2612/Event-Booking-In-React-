# EventBooker - Dynamic React Event Booking Application

A modern, dynamic, and scalable event booking application built with React, featuring modular architecture, dynamic theming, and environment-based configuration.

## 🚀 Features

### Core Functionality
- **Event Discovery**: Browse and search events with advanced filtering
- **Seat Selection**: Interactive seat map with real-time availability
- **Booking Management**: Complete booking flow with payment processing
- **Order Management**: View and manage bookings with ticket downloads

### Dynamic Architecture
- **Modular Components**: Fully decomposed component architecture
- **Context-Based State Management**: Centralized state with React Context and reducers
- **Dynamic Routing**: React Router with nested routes and navigation
- **Environment Configuration**: Multi-environment support (dev, test, production)
- **API Integration**: Dynamic API layer with mock data fallback
- **Theme System**: Multiple themes with customization options

### Advanced Features
- **Error Boundaries**: Graceful error handling with recovery options
- **Loading States**: Comprehensive loading indicators
- **Local Storage**: Data persistence for offline capability
- **Responsive Design**: Mobile-first responsive interface
- **Debug Mode**: Development debugging tools

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── EventsView.jsx          # Event listing and search
│   ├── SeatsView.jsx           # Seat selection interface
│   ├── CheckoutView.jsx        # Payment and booking form
│   ├── ConfirmationView.jsx    # Booking confirmation
│   ├── OrdersView.jsx          # Order management
│   ├── EventBookingApp.jsx     # Main app container
│   ├── Router.jsx              # Route configuration
│   ├── LoadingSpinner.jsx      # Loading component
│   └── ErrorBoundary.jsx       # Error handling
├── context/
│   ├── EventContext.jsx        # Event data management
│   └── ThemeContext.jsx        # Theme management
├── hooks/
│   └── useBooking.js           # Booking state management
├── services/
│   └── api.js                  # API service layer
├── config/
│   └── environment.js          # Environment configuration
└── App.jsx                     # Root component
```

### State Management
- **Event Context**: Manages event data, CRUD operations, and API integration
- **Theme Context**: Handles dynamic theming and customization
- **Booking Hook**: Manages booking flow state and operations
- **Local Storage**: Persists data for offline functionality

### API Layer
- **Dynamic Endpoints**: Environment-based API configuration
- **Mock Data Fallback**: Seamless development experience
- **Error Handling**: Comprehensive error management with retries
- **Caching**: Local storage caching for improved performance

## 🎨 Theming System

### Available Themes
- **Default**: Blue/purple gradient theme
- **Dark Mode**: Dark background with purple accents
- **Vibrant**: Pink/orange energetic theme
- **Minimal**: Clean gray/slate theme

### Theme Features
- Dynamic theme switching
- Custom color customization
- Persistent theme preferences
- CSS class generation for styling
- Gradient support

## ⚙️ Environment Configuration

### Environment Types
- **Development**: Full debugging, mock data enabled
- **Test**: Testing configuration with extended timeouts
- **Production**: Optimized for performance and security

### Configurable Features
- API endpoints
- Payment gateway settings
- Feature flags (admin panel, analytics, etc.)
- Session and cache timeouts
- Maximum seats per booking
- Debug mode settings

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_APP_VERSION=1.0.0
VITE_BUILD_TIME=2025-01-01T00:00:00Z
MODE=development
```

## 🔧 Configuration

### Feature Flags
Enable/disable features via environment configuration:
```javascript
FEATURES: {
  REAL_TIME_UPDATES: true,
  ADVANCED_SEARCH: true,
  ADMIN_PANEL: true,
  ANALYTICS: false
}
```

### API Configuration
Configure API endpoints for different environments:
```javascript
development: {
  API_BASE_URL: 'http://localhost:3001/api',
  ENABLE_MOCK_DATA: true,
  PAYMENT_GATEWAY: 'sandbox'
}
```

## 📱 Usage

### Event Browsing
- Browse events with category filtering
- Search by event name or city
- View detailed event information
- Dynamic loading with pagination

### Booking Process
1. Select an event
2. Choose seats from interactive map
3. Fill customer and payment information
4. Confirm booking and receive tickets

### Order Management
- View all bookings
- Download tickets
- Cancel bookings
- QR code support for entry

## 🛠️ Development

### Component Development
- Use provided hooks for state management
- Follow the modular component pattern
- Implement error boundaries for new features
- Use the theme context for styling

### API Integration
- Use the provided API service layer
- Implement proper error handling
- Support both real and mock data
- Follow the retry pattern for robustness

### State Management
- Leverage React Context for global state
- Use custom hooks for component-specific logic
- Implement proper loading and error states
- Persist important data to localStorage

## 🔐 Security

- Environment-based configuration
- Input validation on all forms
- Secure payment processing (test mode available)
- Error logging in production
- Data sanitization

## 📈 Performance

- Code splitting with React.lazy
- Memoized components and hooks
- Efficient state updates with reducers
- Local caching with configurable expiration
- Optimized bundle sizes

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 📋 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Follow the component architecture
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with React 19, Vite, Tailwind CSS, and modern development practices.**
