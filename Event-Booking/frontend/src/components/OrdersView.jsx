import React from 'react';
import { Calendar, Clock, MapPin, Download, X } from 'lucide-react';

const OrdersView = ({ 
  orders, 
  cancelBooking,
  onBackToEvents 
}) => {
  const handleCancelBooking = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(orderId);
        alert('Booking cancelled successfully');
      } catch (error) {
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleDownloadTickets = (order) => {
    const ticketData = {
      bookingId: order.id,
      event: order.event.title,
      seats: order.seats.map(s => s.id),
      customer: order.customer.name,
      total: order.total,
      qrCode: order.qrCode
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ticketData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `tickets-${order.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <button
              onClick={onBackToEvents}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </button>
          </div>
          <p className="text-gray-600 mt-2">View and manage your event bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{order.event.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
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
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Order #{order.id}</div>
                      <div className="text-sm text-gray-600">Booked on {order.bookingDate}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Booking Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer:</span>
                          <span>{order.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span>{order.customer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span>{order.customer.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seats:</span>
                          <span>{order.seats.map(s => s.id).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Payment Summary</h4>
                      <div className="space-y-2 text-sm">
                        {order.seats.map(seat => (
                          <div key={seat.id} className="flex justify-between">
                            <span className="text-gray-600">Seat {seat.id}:</span>
                            <span>${seat.price}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total Paid:</span>
                          <span className="text-green-600">${order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
                    {order.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleDownloadTickets(order)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download Tickets
                        </button>
                        
                        <button
                          onClick={() => handleCancelBooking(order.id)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Cancel Booking
                        </button>
                      </>
                    )}
                    
                    {order.status === 'cancelled' && (
                      <div className="text-sm text-gray-500 italic">
                        This booking has been cancelled
                      </div>
                    )}
                  </div>

                  {/* QR Code Info */}
                  {order.status === 'confirmed' && order.qrCode && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">Entry QR Code Available</p>
                          <p className="text-xs text-blue-600">Show at venue entrance</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-200 border border-blue-300 rounded flex items-center justify-center">
                          <span className="text-xs text-blue-700">QR</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h3>
            <p className="text-gray-600 text-lg mb-8">
              You haven't made any bookings yet. Start exploring events to make your first booking!
            </p>
            <button
              onClick={onBackToEvents}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Browse Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersView;