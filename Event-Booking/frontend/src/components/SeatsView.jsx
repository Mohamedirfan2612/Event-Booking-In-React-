import React, { useMemo } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { ENV_CONFIG } from '../config/environment';

const SeatsView = ({ 
  selectedEvent, 
  selectedSeats, 
  handleSeatClick, 
  generateSeats,
  getBookingSummary,
  onBack, 
  onProceed 
}) => {
  const seats = useMemo(() => {
    return selectedEvent ? generateSeats(selectedEvent.id, selectedEvent) : [];
  }, [selectedEvent, generateSeats]);

  const bookingSummary = getBookingSummary();

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No event selected</h3>
          <p className="text-gray-600 mb-6">Please select an event to view seats</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const groupedSeats = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Events
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h1>
              <p className="text-gray-600">{selectedEvent.venue}, {selectedEvent.city}</p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {new Date(selectedEvent.date).toDateString()} at {selectedEvent.time}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Users className="h-4 w-4" />
                {selectedEvent.availableSeats} seats available
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="bg-gray-800 text-white py-2 px-8 rounded-lg inline-block mb-4">
                  🎭 STAGE
                </div>
                <h3 className="text-lg font-semibold">Select Your Seats</h3>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded border"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded border"></div>
                  <span>Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
                  <span>Premium</span>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="space-y-2">
                {Object.entries(groupedSeats).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center justify-center gap-1">
                    <span className="w-6 text-center font-medium text-gray-600">{row}</span>
                    <div className="flex gap-1">
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeats.find(s => s.id === seat.id);
                        const isPremium = seat.row <= 'C';
                        
                        return (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.isBooked}
                            className={`
                              w-8 h-8 rounded text-xs font-medium border-2 transition-all
                              ${seat.isBooked 
                                ? 'bg-gray-400 border-gray-500 text-white cursor-not-allowed' 
                                : isSelected
                                ? 'bg-blue-500 border-blue-600 text-white'
                                : isPremium
                                ? 'bg-yellow-500 border-yellow-600 text-white hover:bg-yellow-600'
                                : 'bg-green-500 border-green-600 text-white hover:bg-green-600'
                              }
                            `}
                            title={`Seat ${seat.id} - $${seat.price}`}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Max seats warning */}
              {selectedSeats.length >= ENV_CONFIG.MAX_SEATS_PER_BOOKING && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Maximum {ENV_CONFIG.MAX_SEATS_PER_BOOKING} seats allowed per booking.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              {selectedSeats.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Select seats to see pricing
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Selected Seats:</span>
                      <span>{selectedSeats.map(s => s.id).join(', ')}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedSeats.map(seat => (
                        <div key={seat.id} className="flex justify-between text-sm">
                          <span>Seat {seat.id} ({seat.row <= 'C' ? 'Premium' : 'Standard'})</span>
                          <span>${seat.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {bookingSummary && (
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${bookingSummary.subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Service Fee:</span>
                        <span>${bookingSummary.fees}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total:</span>
                        <span>${bookingSummary.total}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={onProceed}
                    disabled={selectedSeats.length === 0}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-6"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatsView;