'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
}

/**
 * Assumptions (adjust to match your backend DTO exactly):
 * - availableSeats: int
 * - bookedSeats: int
 * - ticketPrices: float
 * - EventDuration: int
 * - EventCategory: string
 * - eventDateAndTime: ISO string with Z (UTC), e.g. "2025-01-20T14:30:00.000Z"
 */
export default function AddEventModal({
  isOpen,
  onClose,
  onSubmit,
}: AddEventModalProps) {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventLocation: '',
    availableSeats: '',
    bookedSeats: '0', // default for new events
    ticketPrices: '',
    EventDuration: '',
    EventCategory: 'music', // align with your categories
    eventDate: '',
    eventTime: '10:00 AM',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Convert "hh:mm AM/PM" to "HH:mm" 24-hour string
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = modifier === 'AM' ? '00' : '12';
    } else if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Parse numbers with correct types
      const availableSeats = parseInt(formData.availableSeats, 10);
      const bookedSeats = parseInt(formData.bookedSeats, 10);
      const EventDuration = parseInt(formData.EventDuration, 10);
      const ticketPrices = parseFloat(formData.ticketPrices); // float

      if (
        Number.isNaN(availableSeats) ||
        Number.isNaN(bookedSeats) ||
        Number.isNaN(EventDuration) ||
        Number.isNaN(ticketPrices)
      ) {
        alert(
          'Please provide valid numeric values for seats, duration, and price.'
        );
        setIsSubmitting(false);
        return;
      }

      if (!formData.eventDate) {
        alert('Please select an event date.');
        setIsSubmitting(false);
        return;
      }

      // Build UTC ISO datetime string with Z
      const time24 = convertTo24Hour(formData.eventTime); // "HH:mm"
      const [year, month, day] = formData.eventDate.split('-').map(Number);
      const [hh, mm] = time24.split(':').map(Number);
      const localDate = new Date(year, month - 1, day, hh, mm, 0, 0);
      const eventDateAndTime = localDate.toISOString(); // e.g., "2025-01-20T14:30:00.000Z"

      // Payload: adjust keys to exactly what your backend expects.
      const payload = {
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
        eventLocation: formData.eventLocation,
        availableSeats, // int
        bookedSeats, // int
        ticketPrices, // float
        EventDuration, // int (rename to EventDuration if required)
        EventCategory: formData.EventCategory, // string (rename to EventCategory if required)
        eventDateAndTime, // ISO string with Z
      };

      const response = await fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
      }

      const newEvent = await response.json();

      onSubmit(newEvent);

      // Reset form
      setFormData({
        eventName: '',
        eventDescription: '',
        eventLocation: '',
        availableSeats: '',
        bookedSeats: '0',
        ticketPrices: '',
        EventDuration: '',
        EventCategory: 'music',
        eventDate: '',
        eventTime: '10:00 AM',
      });

      alert('Event created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      eventName: '',
      eventDescription: '',
      eventLocation: '',
      availableSeats: '',
      bookedSeats: '0',
      ticketPrices: '',
      EventDuration: '',
      EventCategory: 'music',
      eventDate: '',
      eventTime: '10:00 AM',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Event
          </h2>

          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              placeholder="Yoga Workshop"
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Description
            </label>
            <textarea
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleInputChange}
              placeholder="Enter a detailed description of the event..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Event Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Location
            </label>
            <input
              type="text"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleInputChange}
              placeholder="Serenity Studio, Downtown"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Date and Time Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date
              </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Time
              </label>
              <select
                name="eventTime"
                value={formData.eventTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="08:00 AM">08:00 AM</option>
                <option value="08:30 AM">08:30 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="05:30 PM">05:30 PM</option>
                <option value="06:00 PM">06:00 PM</option>
                <option value="06:30 PM">06:30 PM</option>
                <option value="07:00 PM">07:00 PM</option>
                <option value="07:30 PM">07:30 PM</option>
                <option value="08:00 PM">08:00 PM</option>
              </select>
            </div>
          </div>

          {/* Duration and Category Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Duration (minutes)
              </label>
              <select
                name="EventDuration"
                value={formData.EventDuration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Duration</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour (60 minutes)</option>
                <option value="90">1.5 hours (90 minutes)</option>
                <option value="120">2 hours (120 minutes)</option>
                <option value="150">2.5 hours (150 minutes)</option>
                <option value="180">3 hours (180 minutes)</option>
                <option value="240">4 hours (240 minutes)</option>
                <option value="300">5 hours (300 minutes)</option>
                <option value="360">6 hours (360 minutes)</option>
                <option value="480">8 hours (480 minutes)</option>
                <option value="720">12 hours (720 minutes)</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Category
              </label>
              <select
                name="EventCategory"
                value={formData.EventCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {/* Ensure values match backend enum/expected strings */}
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="culture">Arts & Culture</option>
                <option value="food">Food & Drink</option>
                <option value="workshop">Workshops</option>
                <option value="others">Others</option>
              </select>
            </div>
          </div>

          {/* Seats and Pricing Row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text sm font-medium text-gray-700 mb-2">
                Available Seats
              </label>
              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleInputChange}
                placeholder="50"
                min={1}
                max={10000}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booked Seats
              </label>
              <input
                type="number"
                name="bookedSeats"
                value={formData.bookedSeats}
                onChange={handleInputChange}
                placeholder="0"
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                disabled
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Price ($)
              </label>
              <input
                type="number"
                name="ticketPrices"
                value={formData.ticketPrices}
                onChange={handleInputChange}
                placeholder="25.00"
                min={0}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md transition-colors ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 text-white rounded-md transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : (
                'Add Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}