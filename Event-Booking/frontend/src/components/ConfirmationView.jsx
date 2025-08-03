import React from 'react';
import { CheckCircle, Download, Calendar, MapPin, Users, Star } from 'lucide-react';
import { ENV_CONFIG } from '../config/environment';

const ConfirmationView = ({ 
  bookingData, 
  onNewBooking 
}) => {
  if (!bookingData || !bookingData.event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❓</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No booking confirmation found</h3>
          <p className="text-gray-600 mb-6">It looks like there's no recent booking to confirm</p>
          <button
            onClick={onNewBooking}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const { event, seats, customer, total, bookingDate, status, qrCode, tickets } = bookingData;

  const handleDownloadTickets = () => {
    // In a real app, this would generate and download actual tickets
    const ticketData = {
      bookingId: bookingData.id,
      event: event.title,
      seats: seats.map(s => s.id),
      customer: customer.name,
      total,
      qrCode
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ticketData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `tickets-${bookingData.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleSendEmail = () => {
    // Simulate sending confirmation email
    alert('Confirmation email sent to ' + customer.email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Success Header */}
      <div className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="mb-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Your tickets have been successfully booked. Confirmation details below.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Event Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{event.rating} rating</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(event.date).toDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{event.venue}, {event.city}</span>
                  </div>
                </div>
                
                {event.description && (
                  <p className="text-gray-600 text-sm mt-3">{event.description}</p>
                )}
              </div>
            </div>

            {/* Ticket Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Your Tickets</h3>
              
              <div className="space-y-3">
                {seats.map((seat, index) => (
                  <div key={seat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">Seat {seat.id}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({seat.row <= 'C' ? 'Premium' : 'Standard'})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${seat.price}</div>
                      {tickets && tickets[index] && (
                        <div className="text-xs text-gray-500">
                          {tickets[index].ticketNumber}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Customer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium">{customer.phone}</p>
                </div>
                {customer.city && (
                  <div>
                    <span className="text-sm text-gray-600">City:</span>
                    <p className="font-medium">{customer.city}</p>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code (placeholder) */}
            {qrCode && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Entry QR Code</h3>
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500 text-center">
                      QR Code<br />
                      {qrCode.split('/').pop()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Show this code at the venue entrance
                </p>
              </div>
            )}
          </div>

          {/* Booking Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Booking ID:</span>
                  <span className="font-mono text-sm">{bookingData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date Booked:</span>
                  <span className="text-sm">{bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-medium ${
                    status === 'confirmed' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Number of Seats:</span>
                  <span className="text-sm">{seats.length}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Total Paid:</span>
                  <span className="text-green-600">${total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDownloadTickets}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Tickets
                </button>
                
                <button
                  onClick={handleSendEmail}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Resend Confirmation Email
                </button>
                
                <button
                  onClick={onNewBooking}
                  className="w-full text-blue-600 border border-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Book Another Event
                </button>
              </div>

              {/* Important Notes */}
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-1">Important Notes:</h4>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Please arrive 30 minutes before the event</li>
                  <li>• Bring a valid ID for verification</li>
                  <li>• Show your QR code at the entrance</li>
                  {ENV_CONFIG.PAYMENT_GATEWAY === 'test' && (
                    <li>• This is a test booking - no real payment was processed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationView;