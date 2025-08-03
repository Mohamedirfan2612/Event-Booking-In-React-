import { ENV_CONFIG, getApiUrl, debugLog } from '../config/environment';

// Base API configuration
const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000
};

// Helper function to simulate network delay in development
const simulateDelay = (ms = 500) => {
  if (ENV_CONFIG.ENABLE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  return Promise.resolve();
};

// Generic fetch wrapper with error handling
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  debugLog('API Request:', { url, method: config.method || 'GET' });

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    debugLog('API Response:', data);
    
    return data;
  } catch (error) {
    debugLog('API Error:', error);
    throw error;
  }
};

// Retry wrapper for failed requests
const withRetry = async (fn, retries = API_CONFIG.retries) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

// Events API
export const eventsApi = {
  // Get all events
  async getEvents(filters = {}) {
    await simulateDelay();
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      // Return mock data
      const mockEvents = JSON.parse(localStorage.getItem('eventBooker_events') || '[]');
      return { data: mockEvents, total: mockEvents.length };
    }
    
    const queryParams = new URLSearchParams(filters).toString();
    const url = getApiUrl(`/events${queryParams ? `?${queryParams}` : ''}`);
    
    return withRetry(() => apiRequest(url));
  },

  // Get event by ID
  async getEvent(id) {
    await simulateDelay();
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const events = JSON.parse(localStorage.getItem('eventBooker_events') || '[]');
      const event = events.find(e => e.id === parseInt(id));
      if (!event) throw new Error('Event not found');
      return { data: event };
    }
    
    const url = getApiUrl(`/events/${id}`);
    return withRetry(() => apiRequest(url));
  },

  // Create new event
  async createEvent(eventData) {
    await simulateDelay();
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const events = JSON.parse(localStorage.getItem('eventBooker_events') || '[]');
      const newEvent = {
        ...eventData,
        id: Date.now(),
        rating: 0,
        availableSeats: eventData.totalSeats || 100
      };
      events.push(newEvent);
      localStorage.setItem('eventBooker_events', JSON.stringify(events));
      return { data: newEvent };
    }
    
    const url = getApiUrl('/events');
    return withRetry(() => apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(eventData)
    }));
  },

  // Update event
  async updateEvent(id, updates) {
    await simulateDelay();
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const events = JSON.parse(localStorage.getItem('eventBooker_events') || '[]');
      const index = events.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Event not found');
      
      events[index] = { ...events[index], ...updates };
      localStorage.setItem('eventBooker_events', JSON.stringify(events));
      return { data: events[index] };
    }
    
    const url = getApiUrl(`/events/${id}`);
    return withRetry(() => apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }));
  },

  // Delete event
  async deleteEvent(id) {
    await simulateDelay();
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const events = JSON.parse(localStorage.getItem('eventBooker_events') || '[]');
      const filteredEvents = events.filter(e => e.id !== id);
      localStorage.setItem('eventBooker_events', JSON.stringify(filteredEvents));
      return { success: true };
    }
    
    const url = getApiUrl(`/events/${id}`);
    return withRetry(() => apiRequest(url, { method: 'DELETE' }));
  }
};

// Bookings API
export const bookingsApi = {
  // Create booking
  async createBooking(bookingData) {
    await simulateDelay();
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const bookings = JSON.parse(localStorage.getItem('eventBooker_orders') || '[]');
      const newBooking = {
        ...bookingData,
        id: Date.now(),
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'confirmed'
      };
      bookings.push(newBooking);
      localStorage.setItem('eventBooker_orders', JSON.stringify(bookings));
      return { data: newBooking };
    }
    
    const url = getApiUrl('/bookings');
    return withRetry(() => apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }));
  },

  // Get user bookings
  async getBookings(userId) {
    await simulateDelay();
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const bookings = JSON.parse(localStorage.getItem('eventBooker_orders') || '[]');
      return { data: bookings };
    }
    
    const url = getApiUrl(`/bookings${userId ? `?userId=${userId}` : ''}`);
    return withRetry(() => apiRequest(url));
  },

  // Cancel booking
  async cancelBooking(bookingId) {
    await simulateDelay();
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const bookings = JSON.parse(localStorage.getItem('eventBooker_orders') || '[]');
      const index = bookings.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        bookings[index].status = 'cancelled';
        localStorage.setItem('eventBooker_orders', JSON.stringify(bookings));
        return { data: bookings[index] };
      }
      throw new Error('Booking not found');
    }
    
    const url = getApiUrl(`/bookings/${bookingId}/cancel`);
    return withRetry(() => apiRequest(url, { method: 'PUT' }));
  }
};

// Search API
export const searchApi = {
  // Search events
  async searchEvents(query, filters = {}) {
    await simulateDelay(200);
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const events = JSON.parse(localStorage.getItem('eventBooker_events') || '[]');
      const filteredEvents = events.filter(event => {
        const matchesQuery = !query || 
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.city.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase());
        
        const matchesCategory = !filters.category || 
          filters.category === 'all' || 
          event.category === filters.category;
        
        const matchesDateRange = !filters.dateFrom || 
          new Date(event.date) >= new Date(filters.dateFrom);
        
        const matchesPriceRange = !filters.maxPrice || 
          event.price <= filters.maxPrice;
        
        return matchesQuery && matchesCategory && matchesDateRange && matchesPriceRange;
      });
      
      return { data: filteredEvents, total: filteredEvents.length };
    }
    
    const searchParams = new URLSearchParams({ 
      q: query, 
      ...filters 
    }).toString();
    const url = getApiUrl(`/search/events?${searchParams}`);
    
    return withRetry(() => apiRequest(url));
  },

  // Get search suggestions
  async getSearchSuggestions(query) {
    await simulateDelay(100);
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      const events = JSON.parse(localStorage.getItem('eventBooker_events') || '[]');
      const suggestions = events
        .filter(event => 
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.city.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(event => ({
          type: 'event',
          title: event.title,
          subtitle: `${event.city} • ${event.category}`
        }));
      
      return { data: suggestions };
    }
    
    const url = getApiUrl(`/search/suggestions?q=${encodeURIComponent(query)}`);
    return withRetry(() => apiRequest(url));
  }
};

// Analytics API (if enabled)
export const analyticsApi = {
  async trackEvent(eventName, properties = {}) {
    if (!ENV_CONFIG.FEATURES.ANALYTICS) return;
    
    debugLog('Analytics Event:', { eventName, properties });
    
    if (ENV_CONFIG.ENABLE_MOCK_DATA) {
      // Mock analytics tracking
      return { success: true };
    }
    
    const url = getApiUrl('/analytics/events');
    return apiRequest(url, {
      method: 'POST',
      body: JSON.stringify({ event: eventName, properties })
    });
  }
};

// Export all APIs
export default {
  events: eventsApi,
  bookings: bookingsApi,
  search: searchApi,
  analytics: analyticsApi
};