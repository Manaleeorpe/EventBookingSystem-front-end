'use client';

import { useState } from 'react';
import { Event } from '@/lib/types';

import { useUser } from '@/app/UserContext';

interface TicketType {
  id: string;
  name: string;
  price: number;
  selected: boolean;
  quantity: number;
}

interface TicketPurchaseFormProps {
  event: Event;
  onClose: () => void;
}

const TicketPurchaseForm = ({ event, onClose }: TicketPurchaseFormProps) => {

   const { user, setUser, loading } = useUser();
    const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL;
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { id: 'general', name: 'General Admission', price: 75, selected: true, quantity: 1 },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const updateTicketQuantity = (id: string, increment: boolean) => {
    setTicketTypes(prev => prev.map(ticket => {
      if (ticket.id === id) {
        const newQuantity = increment ? ticket.quantity + 1 : Math.max(0, ticket.quantity - 1);
        return {
          ...ticket,
          quantity: newQuantity,
          selected: newQuantity > 0
        };
      }
      return ticket;
    }));
  };

  const calculateTotal = () => {
    const ticketTotal = ticketTypes.reduce((sum, ticket) => sum + (event.ticketPrices * ticket.quantity), 0);
    return ticketTotal;
  };



  const purchaseTicket = async () => {
    setIsLoading(true);

   
    
    try {
      const response = await fetch(`${API_BASE_URL}/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id, // You may want to get this from user context/auth
          eventId: event.id,
          price: calculateTotal()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Ticket purchased successfully:', result);
      
      // Show success message or handle success
      alert('Ticket purchased successfully!');
      onClose();
      
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
      alert('Failed to purchase ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
////////////////////////
  const handlePurchase = async () => {
     setIsLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        userId: user?.id, // You may want to get this from user context/auth
        eventId: event.id,
        price: calculateTotal()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Ticket purchased successfully:', result);
    
    // Show success message
    alert('Ticket purchased successfully!');
    onClose();
    
  } catch (error) {
    console.error('Failed to purchase ticket:', error);
    alert('Failed to purchase ticket. Please try again.');
  } finally {
    setIsLoading(false);
  }
  };

  const handleCancel = () => {
    console.log('Purchase cancelled');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Your Ticket</h2>
            <div className="text-gray-600">
              <p className="font-medium">{event.eventName}</p>
              <p>{event.eventLocation}</p>
             <p>
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(event.eventDateAndTime))}
            </p>
              {event.eventDescription && (
                <p className="text-sm mt-1 text-gray-500">{event.eventDescription}</p>
              )}
            </div>
          </div>

          {/* Ticket Types */}
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <img 
                src={event.imageUrl || "/api/placeholder/80/80"}
                alt={event.eventName}
                className="w-20 h-20 rounded-lg object-cover mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">Tickets</h3>
                <div className="space-y-3">
                  {ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          ticket.selected ? 'bg-gray-400 border-gray-400' : 'border-gray-300'
                        }`} />
                        <span className="text-gray-700">
                          {ticket.name} - ${event.ticketPrices} 
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700">{ticket.quantity}</span>
                        <button
                          onClick={() => updateTicketQuantity(ticket.id, false)}
                          className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                          disabled={isLoading}
                        >
                          −
                        </button>
                        <button
                          onClick={() => updateTicketQuantity(ticket.id, true)}
                          className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                          disabled={isLoading}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Total and Actions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total: ${calculateTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Confirm Purchase'}
            </button>

            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full text-blue-600 py-2 hover:underline disabled:text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPurchaseForm;