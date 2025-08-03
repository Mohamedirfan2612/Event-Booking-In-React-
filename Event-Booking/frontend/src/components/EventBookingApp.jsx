import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useBooking } from '../hooks/useBooking';
import EventsView from './EventsView';
import SeatsView from './SeatsView';
import CheckoutView from './CheckoutView';
import ConfirmationView from './ConfirmationView';
import OrdersView from './OrdersView';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';
import { ENV_CONFIG, debugLog } from '../config/environment';

const EventBookingApp = () => {
  const { view } = useParams();
  const navigate = useNavigate();
  
  // Context and hooks
  const { events, categories, iconMap, loading, error } = useEvents();
  const booking = useBooking();
  
  // Local state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Determine current view from URL or booking state
  const currentView = view || booking.currentView || 'events';

  // Debug logging
  debugLog('EventBookingApp render', {
    currentView,
    eventsCount: events.length,
    selectedEvent: booking.selectedEvent?.title,
    selectedSeatsCount: booking.selectedSeats.length
  });

  // Handle navigation
  const handleNavigation = (newView, eventId = null) => {
    booking.setCurrentView(newView);
    
    if (eventId) {
      navigate(`/booking/${eventId}/${newView}`);
    } else {
      navigate(`/events/${newView}`);
    }
  };

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Loading events..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Enhanced props for child components
  const commonProps = {
    events,
    categories,
    iconMap,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    onNavigate: handleNavigation,
    ...booking
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'events':
        return (
          <EventsView
            {...commonProps}
            handleEventSelect={(event) => {
              booking.handleEventSelect(event);
              handleNavigation('seats', event.id);
            }}
          />
        );
      
      case 'seats':
        return (
          <SeatsView
            {...commonProps}
            onBack={() => handleNavigation('events')}
            onProceed={() => handleNavigation('checkout', booking.selectedEvent?.id)}
          />
        );
      
      case 'checkout':
        return (
          <CheckoutView
            {...commonProps}
            onBack={() => handleNavigation('seats', booking.selectedEvent?.id)}
            onComplete={(customerData) => {
              booking.handleBooking(customerData);
              handleNavigation('confirmation', booking.selectedEvent?.id);
            }}
          />
        );
      
      case 'confirmation':
        return (
          <ConfirmationView
            {...commonProps}
            onNewBooking={() => {
              booking.resetBooking();
              handleNavigation('events');
            }}
          />
        );
      
      case 'orders':
        return (
          <OrdersView
            {...commonProps}
            onBackToEvents={() => handleNavigation('events')}
          />
        );
      
      default:
        return (
          <EventsView
            {...commonProps}
            handleEventSelect={(event) => {
              booking.handleEventSelect(event);
              handleNavigation('seats', event.id);
            }}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Debug info (development only) */}
        {ENV_CONFIG.DEBUG_MODE && (
          <div className="bg-yellow-100 border-b border-yellow-300 p-2 text-xs">
            <span className="font-mono">
              Debug: {ENV_CONFIG.APP_NAME} v{ENV_CONFIG.VERSION} | 
              View: {currentView} | 
              Events: {events.length} | 
              Selected: {booking.selectedSeats.length} seats
            </span>
          </div>
        )}
        
        {renderView()}
      </div>
    </ErrorBoundary>
  );
};

export default EventBookingApp;