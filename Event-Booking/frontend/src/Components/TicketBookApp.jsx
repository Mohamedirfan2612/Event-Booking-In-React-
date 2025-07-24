import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Star,
  Search,
  Guitar,
  Laptop,
  Theater,
  Music,
  Coffee,
  Activity
} from 'lucide-react';

const TicketBookingApp = () => {
  const [currentView, setCurrentView] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [orders, setOrders] = useState([]);

  // Mock data
  const events = [
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

  const categories = [
    { id: 'all', name: 'All Events', icon: '🎫' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'theater', name: 'Theater', icon: '🎭' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'conference', name: 'Conference', icon: '💼' },
    { id: 'festival', name: 'Festival', icon: '🎉' }
  ];

  // Map event IDs to Lucide icons
  const iconMap = {
    1: <Guitar className="h-16 w-16 text-purple-600" />,
    2: <Laptop className="h-16 w-16 text-blue-600" />,
    3: <Theater className="h-16 w-16 text-red-600" />,
    4: <Music className="h-16 w-16 text-indigo-600" />,
    5: <Coffee className="h-16 w-16 text-pink-600" />,
    6: <Activity className="h-16 w-16 text-orange-600" />
  };

  // Generate seat layout
  const generateSeats = (eventId) => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    const seats = [];

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        const isBooked = Math.random() < 0.3; // 30% chance of being booked
        seats.push({
          id: seatId,
          row,
          number: i,
          isBooked,
          price: row <= 'C' ? selectedEvent?.price * 1.5 : selectedEvent?.price
        });
      }
    });
    return seats;
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setCurrentView('seats');
    setSelectedSeats([]);
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    setSelectedSeats(prev => {
      const isSelected = prev.find(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleBooking = (customerData) => {
    const newOrder = {
      id: Date.now(),
      event: selectedEvent,
      seats: selectedSeats,
      customer: customerData,
      total: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'confirmed'
    };

    setOrders(prev => [...prev, newOrder]);
    setBookingData(newOrder);
    setCurrentView('confirmation');
  };

  const EventsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🎫 EventBooker</h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    filterCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl cursor-pointer transform hover:scale-105 transition-transform"
              onClick={() => handleEventSelect(event)}
            >
              <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                {iconMap[event.id]}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{event.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.venue}, {event.city}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {event.availableSeats} seats available
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">${event.price}</span>
                  <button
                    onClick={() => handleEventSelect(event)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Orders Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setCurrentView('orders')}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          aria-label="View Orders"
        >
          <span className="text-xl">📋</span>
        </button>
      </div>
    </div>
  );

  const SeatsView = () => {
    const seats = generateSeats(selectedEvent.id);
    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('events')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Events
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h1>
            </div>
            <div className="mt-2 text-gray-600">
              {new Date(selectedEvent.date).toDateString()} at {selectedEvent.time} • {selectedEvent.venue}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seat Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Select Your Seats</h2>

                {/* Stage */}
                <div className="bg-gray-800 text-white text-center py-3 rounded-lg mb-8">
                  🎭 STAGE
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    Available
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    Selected
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    Booked
                  </div>
                </div>

                {/* Seats */}
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(row => (
                    <div key={row} className="flex items-center gap-2">
                      <div className="w-8 text-center font-semibold text-gray-600">{row}</div>
                      <div className="flex gap-1">
                        {seats.filter(seat => seat.row === row).map(seat => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.isBooked}
                            className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                              seat.isBooked
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : selectedSeats.find(s => s.id === seat.id)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                            aria-pressed={selectedSeats.find(s => s.id === seat.id) ? 'true' : 'false'}
                            aria-label={`Seat ${seat.id} ${seat.isBooked ? 'booked' : 'available'}`}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-4">Booking Summary</h3>

                {selectedSeats.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6">
                      {selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between">
                          <span>Seat {seat.id}</span>
                          <span>${seat.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentView('checkout')}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Select seats to see booking summary
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CheckoutView = () => {
    const [customerData, setCustomerData] = useState({
      name: '',
      email: '',
      phone: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });

    const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleBooking(customerData);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setCurrentView('seats')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Seats
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Customer Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customerData.email}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerData.phone}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    value={customerData.cardNumber}
                    onChange={(e) => setCustomerData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={customerData.expiryDate}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={customerData.cvv}
                      onChange={(e) => setCustomerData(prev => ({ ...prev, cvv: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-6"
                >
                  Complete Booking - ${totalPrice}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{iconMap[selectedEvent.id]}</div>
                  <div>
                    <h3 className="font-semibold">{selectedEvent.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedEvent.date).toDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {selectedEvent.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedEvent.venue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <h4 className="font-semibold mb-3">Selected Seats</h4>
                <div className="space-y-2">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between text-sm">
                      <span>Seat {seat.id}</span>
                      <span>${seat.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmationView = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8">Your tickets have been successfully booked.</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div><strong>Order ID:</strong> #{bookingData.id}</div>
              <div><strong>Event:</strong> {bookingData.event?.title}</div>
              <div><strong>Date:</strong> {new Date(bookingData.event?.date).toDateString()}</div>
              <div><strong>Time:</strong> {bookingData.event?.time}</div>
              <div><strong>Venue:</strong> {bookingData.event?.venue}</div>
              <div><strong>Seats:</strong> {bookingData.seats?.map(s => s.id).join(', ')}</div>
              <div><strong>Total Paid:</strong> ${bookingData.total}</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentView('events');
                setSelectedEvent(null);
                setSelectedSeats([]);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book More Tickets
            </button>
            <button
              onClick={() => setCurrentView('orders')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentView('events')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Events
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                    <p className="text-gray-600">Booked on {new Date(order.bookingDate).toDateString()}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Event Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div><strong>{order.event.title}</strong></div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.event.date).toDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {order.event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {order.event.venue}, {order.event.city}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Customer:</strong> {order.customer.name}</div>
                      <div><strong>Email:</strong> {order.customer.email}</div>
                      <div><strong>Seats:</strong> {order.seats.map(s => s.id).join(', ')}</div>
                      <div><strong>Total Paid:</strong> <span className="text-lg font-bold text-green-600">${order.total}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Download Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start booking tickets to see your orders here</p>
            <button
              onClick={() => setCurrentView('events')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Main render switch
  switch (currentView) {
    case 'events':
      return <EventsView />;
    case 'seats':
      return <SeatsView />;
    case 'checkout':
      return <CheckoutView />;
    case 'confirmation':
      return <ConfirmationView />;
    case 'orders':
      return <OrdersView />;
    default:
      return <EventsView />;
  }
};

export default TicketBookingApp;
