import { useState, useCallback } from 'react';

// Custom hook for managing booking state
export const useBooking = () => {
  const [currentView, setCurrentView] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [orders, setOrders] = useState(() => {
    // Load orders from localStorage on initialization
    const savedOrders = localStorage.getItem('eventBooker_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Save orders to localStorage whenever orders change
  const saveOrders = useCallback((newOrders) => {
    localStorage.setItem('eventBooker_orders', JSON.stringify(newOrders));
    setOrders(newOrders);
  }, []);

  // Generate seat layout for an event
  const generateSeats = useCallback((eventId, selectedEvent) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    const seats = [];

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        // Use eventId to generate consistent random booking state
        const seed = eventId * 1000 + row.charCodeAt(0) * 100 + i;
        const isBooked = (seed * 9301 + 49297) % 233280 / 233280 < 0.3; // 30% chance
        
        seats.push({
          id: seatId,
          row,
          number: i,
          isBooked,
          price: row <= 'C' ? Math.round(selectedEvent?.price * 1.5) : selectedEvent?.price
        });
      }
    });
    return seats;
  }, []);

  // Handle event selection
  const handleEventSelect = useCallback((event) => {
    setSelectedEvent(event);
    setCurrentView('seats');
    setSelectedSeats([]);
  }, []);

  // Handle seat selection
  const handleSeatClick = useCallback((seat) => {
    if (seat.isBooked) return;

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  }, []);

  // Handle booking completion
  const handleBooking = useCallback((customerData) => {
    const newOrder = {
      id: Date.now(),
      event: selectedEvent,
      seats: selectedSeats,
      customer: customerData,
      total: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      qrCode: generateQRCode(),
      tickets: selectedSeats.map(seat => ({
        seatId: seat.id,
        ticketNumber: `TKT-${Date.now()}-${seat.id}`,
        barcode: generateBarcode()
      }))
    };

    const updatedOrders = [...orders, newOrder];
    saveOrders(updatedOrders);
    setBookingData(newOrder);
    setCurrentView('confirmation');
  }, [selectedEvent, selectedSeats, orders, saveOrders]);

  // Generate QR code data (placeholder)
  const generateQRCode = useCallback(() => {
    return `https://eventbooker.com/verify/${Date.now()}`;
  }, []);

  // Generate barcode (placeholder)
  const generateBarcode = useCallback(() => {
    return Math.random().toString(36).substr(2, 12).toUpperCase();
  }, []);

  // Cancel booking
  const cancelBooking = useCallback((orderId) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' }
        : order
    );
    saveOrders(updatedOrders);
  }, [orders, saveOrders]);

  // Navigate to different views
  const navigateToView = useCallback((view) => {
    setCurrentView(view);
  }, []);

  // Reset booking state
  const resetBooking = useCallback(() => {
    setSelectedEvent(null);
    setSelectedSeats([]);
    setBookingData({});
    setCurrentView('events');
  }, []);

  // Get booking summary
  const getBookingSummary = useCallback(() => {
    if (selectedSeats.length === 0) return null;

    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const fees = Math.round(total * 0.1); // 10% service fee
    const grandTotal = total + fees;

    return {
      subtotal: total,
      fees,
      total: grandTotal,
      seatCount: selectedSeats.length
    };
  }, [selectedSeats]);

  return {
    // State
    currentView,
    selectedEvent,
    selectedSeats,
    bookingData,
    orders,
    
    // Actions
    setCurrentView,
    handleEventSelect,
    handleSeatClick,
    handleBooking,
    cancelBooking,
    navigateToView,
    resetBooking,
    
    // Computed
    generateSeats,
    getBookingSummary,
    
    // Utils
    generateQRCode,
    generateBarcode
  };
};

export default useBooking;