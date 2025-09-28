'use client';

//events home page

import { useCallback, useEffect, useState } from 'react';
import FeaturedCard from '@/components/ui/FeaturedCard';
import EventCard from '@/components/ui/EventCard';
import TicketPurchaseForm from '@/components/ui/BuyTicketModel';
import { apiClient } from '@/lib/api';
import { Event } from '@/lib/types';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiClient.getEvents();
      setFeaturedEvents(res.featuredEvents);
      setEvents(res.events);
      setLoading(false);
    })();
  }, []);

  const handleEventClick = useCallback((ev: Event) => {
    setSelectedEvent(ev);
    setIsTicketOpen(true);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-xl font-semibold mb-4">Featured Events</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[360px] h-[240px] bg-gray-200 rounded-2xl" />
            ))
          : featuredEvents.map((ev) => (
              <FeaturedCard
                key={String(ev.id)}
                title={ev.title || ev.eventName}
                subtitle={ev.subtitle || ''}
                location={ev.location || ev.eventLocation}
                imageUrl={ev.imageUrl}
                category={ev.category}
                onClick={() => handleEventClick(ev)}
              />
            ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-2xl" />
            ))
          : events.map((ev) => (
              <EventCard
                key={String(ev.id)}
                title={ev.title || ev.eventName}
                location={ev.location || ev.eventLocation}
                imageUrl={ev.imageUrl}
                onClick={() => handleEventClick(ev)}
              />
            ))}
      </div>

      {isTicketOpen && selectedEvent && (
        <TicketPurchaseForm
          event={selectedEvent}
          onClose={() => {
            setIsTicketOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </main>
  );
}