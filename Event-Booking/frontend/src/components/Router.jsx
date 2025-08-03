import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventProvider } from '../context/EventContext';
import { ThemeProvider } from '../context/ThemeContext';
import EventBookingApp from './EventBookingApp';
import { isFeatureEnabled } from '../config/environment';

const AppRouter = () => {
  return (
    <ThemeProvider>
      <EventProvider>
        <BrowserRouter>
          <Routes>
            {/* Main booking app route */}
            <Route path="/" element={<EventBookingApp />} />
            <Route path="/events" element={<EventBookingApp />} />
            <Route path="/events/:view" element={<EventBookingApp />} />
            
            {/* Booking flow routes */}
            <Route path="/booking/:eventId/seats" element={<EventBookingApp />} />
            <Route path="/booking/:eventId/checkout" element={<EventBookingApp />} />
            <Route path="/booking/:eventId/confirmation" element={<EventBookingApp />} />
            
            {/* User routes */}
            <Route path="/orders" element={<EventBookingApp />} />
            
            {/* 404 redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </ThemeProvider>
  );
};

export default AppRouter;