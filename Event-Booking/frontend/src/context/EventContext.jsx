import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  Guitar, 
  Laptop, 
  Theater, 
  Music, 
  Coffee, 
  Activity 
} from 'lucide-react';
import { eventsApi } from '../services/api';

// Initial state
const initialState = {
  events: [],
  categories: [
    { id: 'all', name: 'All Events', icon: '🎫' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'theater', name: 'Theater', icon: '🎭' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'conference', name: 'Conference', icon: '💼' },
    { id: 'festival', name: 'Festival', icon: '🎉' }
  ],
  iconMap: {
    1: <Guitar className="h-16 w-16 text-purple-600" />,
    2: <Laptop className="h-16 w-16 text-blue-600" />,
    3: <Theater className="h-16 w-16 text-red-600" />,
    4: <Music className="h-16 w-16 text-indigo-600" />,
    5: <Coffee className="h-16 w-16 text-pink-600" />,
    6: <Activity className="h-16 w-16 text-orange-600" />
  },
  loading: false,
  error: null
};

// Default events data
const defaultEvents = [
  {
    id: 1,
    title: "Rock Concert 2025",
    category: "music",
    date: "2025-08-15",
    time: "19:00",
    venue: "Madison Square Garden",
    city: "New York",
    price: 85,
    rating: 4.8,
    description: "An electrifying night of rock music featuring top bands",
    availableSeats: 250
  },
  {
    id: 2,
    title: "Tech Conference 2025",
    category: "conference",
    date: "2025-09-20",
    time: "09:00",
    venue: "Convention Center",
    city: "San Francisco",
    price: 199,
    rating: 4.6,
    description: "Leading technology conference with industry experts",
    availableSeats: 500
  },
  {
    id: 3,
    title: "Shakespeare's Hamlet",
    category: "theater",
    date: "2025-07-30",
    time: "20:00",
    venue: "Broadway Theater",
    city: "New York",
    price: 120,
    rating: 4.9,
    description: "Classic Shakespeare tragedy performed by renowned actors",
    availableSeats: 180
  },
  {
    id: 4,
    title: "Jazz Night",
    category: "music",
    date: "2025-08-05",
    time: "21:00",
    venue: "Blue Note",
    city: "Chicago",
    price: 65,
    rating: 4.7,
    description: "Smooth jazz evening with world-class musicians",
    availableSeats: 120
  },
  {
    id: 5,
    title: "Food & Wine Festival",
    category: "festival",
    date: "2025-09-10",
    time: "12:00",
    venue: "Central Park",
    city: "New York",
    price: 45,
    rating: 4.5,
    description: "Culinary experience with top chefs and wine tastings",
    availableSeats: 800
  },
  {
    id: 6,
    title: "NBA Championship",
    category: "sports",
    date: "2025-10-15",
    time: "19:30",
    venue: "Staples Center",
    city: "Los Angeles",
    price: 250,
    rating: 4.9,
    description: "Championship game featuring the season's top teams",
    availableSeats: 50
  }
];

// Actions
const eventActions = {
  SET_LOADING: 'SET_LOADING',
  SET_EVENTS: 'SET_EVENTS',
  ADD_EVENT: 'ADD_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const eventReducer = (state, action) => {
  switch (action.type) {
    case eventActions.SET_LOADING:
      return { ...state, loading: action.payload };
    case eventActions.SET_EVENTS:
      return { ...state, events: action.payload, loading: false, error: null };
    case eventActions.ADD_EVENT:
      return { 
        ...state, 
        events: [...state.events, action.payload],
        loading: false 
      };
    case eventActions.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event => 
          event.id === action.payload.id ? action.payload : event
        ),
        loading: false
      };
    case eventActions.DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
        loading: false
      };
    case eventActions.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case eventActions.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Context
const EventContext = createContext();

// Provider component
export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  // Load events function - uses API service
  const loadEvents = async () => {
    dispatch({ type: eventActions.SET_LOADING, payload: true });
    try {
      const response = await eventsApi.getEvents();
      const events = response.data.length > 0 ? response.data : defaultEvents;
      
      // Save to localStorage if we got default events
      if (response.data.length === 0) {
        localStorage.setItem('eventBooker_events', JSON.stringify(defaultEvents));
        dispatch({ type: eventActions.SET_EVENTS, payload: defaultEvents });
      } else {
        dispatch({ type: eventActions.SET_EVENTS, payload: events });
      }
    } catch (error) {
      dispatch({ type: eventActions.SET_ERROR, payload: error.message });
    }
  };

  // Save events to localStorage
  const saveEvents = (events) => {
    localStorage.setItem('eventBooker_events', JSON.stringify(events));
  };

  // Add new event
  const addEvent = async (eventData) => {
    dispatch({ type: eventActions.SET_LOADING, payload: true });
    try {
      const response = await eventsApi.createEvent(eventData);
      dispatch({ type: eventActions.ADD_EVENT, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: eventActions.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update event
  const updateEvent = async (eventId, updates) => {
    dispatch({ type: eventActions.SET_LOADING, payload: true });
    try {
      const response = await eventsApi.updateEvent(eventId, updates);
      dispatch({ type: eventActions.UPDATE_EVENT, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: eventActions.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    dispatch({ type: eventActions.SET_LOADING, payload: true });
    try {
      await eventsApi.deleteEvent(eventId);
      dispatch({ type: eventActions.DELETE_EVENT, payload: eventId });
    } catch (error) {
      dispatch({ type: eventActions.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: eventActions.CLEAR_ERROR });
  };

  const value = {
    ...state,
    loadEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    clearError
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the context
export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventContext;