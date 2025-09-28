'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

// UI components you already have in your project
import SearchBar from '@/components/ui/SearchBar';
import FeaturedCard from '@/components/ui/FeaturedCard';
import EventCard from '@/components/ui/EventCard';
import CategoryTabs from '@/components/ui/CategoryTabs';
import BottomNavigation from '@/components/ui/BottomNavigation';
import Header from '@/components/layout/Header';
import AddEventModal from '@/components/ui/AddEventModel';
import ProfileModal from '@/components/ui/ProfileModal';
import TicketPurchaseForm from '@/components/ui/BuyTicketModel';

import {
  FeaturedCardSkeleton,
  EventCardSkeleton,
} from '@/components/ui/LoadingSkeleton';

// Types from your lib (single source of truth)
import type {
  Event,
  EventsResponse,
  CategoryType,
  ApiResponse,
} from '@/lib/types';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isTicketModelOpen, setIsTicketModelOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const base = useMemo(() => API_BASE_URL.replace(/\/+$/, ''), [API_BASE_URL]);

  const buildQuery = useCallback((params: Record<string, string | undefined>) => {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v.length > 0) usp.set(k, v);
    });
    const qs = usp.toString();
    return qs ? `?${qs}` : '';
  }, []);

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsTicketModelOpen(true);
  }, []);

  // Normalize optional UI aliases so downstream components can rely on them
  function normalize(e: Event): Event {
    return {
      ...e,
      title: e.title ?? e.eventName,
      subtitle: e.subtitle ?? e.eventDescription,
      location: e.location ?? e.eventLocation,
      imageUrl: e.imageUrl ?? undefined,
    };
  }

  // Support multiple possible API response shapes and produce Event[]
  type EventsApiUnion =
    | EventsResponse // { featuredEvents, events, totalCount? }
    | { events: Event[]; totalCount?: number } // simple object
    | Event[] // plain array
    | ApiResponse<EventsResponse>; // wrapped

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const qsAll = buildQuery({
        search: searchQuery || undefined,
        category: category !== 'all' ? category : undefined,
      });

      const urlAll = `${base}/events${qsAll}`;
      const resAll = await fetch(urlAll, { credentials: 'include' });
      if (!resAll.ok) throw new Error(`HTTP ${resAll.status}`);

      const raw: EventsApiUnion = await resAll.json();

      let eventsList: Event[] = [];
      let total = 0;

      if (Array.isArray(raw)) {
        eventsList = raw;
        total = raw.length;
      } else if ('data' in (raw as ApiResponse<EventsResponse>)) {
        const api = raw as ApiResponse<EventsResponse>;
        eventsList = api.data?.events ?? [];
        total = api.total ?? api.data?.totalCount ?? eventsList.length;
      } else if ('events' in (raw as any)) {
        const obj = raw as { events: Event[]; totalCount?: number };
        eventsList = obj.events ?? [];
        total = obj.totalCount ?? eventsList.length;
      } else {
        // final fallback: treat as EventsResponse
        const resp = raw as EventsResponse;
        eventsList = resp.events ?? [];
        total = resp.totalCount ?? eventsList.length;
      }

      eventsList = eventsList.map(normalize);

      // For simplicity, take first 5 as featured (or apply your own rule)
      const featuredList = eventsList.slice(0, 5);

      setEvents(eventsList);
      setFeaturedEvents(featuredList);
      setTotalCount(total);
    } catch (e: any) {
      console.error('Error fetching events:', e);
      setError(e?.message || 'Failed to load events.');
      setEvents([]);
      setFeaturedEvents([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [base, buildQuery, category, searchQuery]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((newCategory: CategoryType) => {
    setCategory(newCategory);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddEvent={() => setIsAddEventModalOpen(true)} />

      <div className="px-4">
        <SearchBar onSearch={handleSearch} />

        {/* Featured Events */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <FeaturedCardSkeleton key={i} />
            ))
          ) : (
            featuredEvents.map((event) => (
              <FeaturedCard
                key={event.id}
                title={event.title ?? event.eventName}
                subtitle={event.subtitle ?? event.eventDescription}
                location={event.location ?? event.eventLocation}
                imageUrl={event.imageUrl ?? undefined}
                onClick={() => handleEventClick(event)}
              />
            ))
          )}
        </div>

        <CategoryTabs
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />

        {/* Regular Events Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Featured Events</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title ?? event.eventName}
                  location={event.location ?? event.eventLocation}
                  imageUrl={event.imageUrl ?? undefined}
                  onClick={() => handleEventClick(event)}
                />
              ))
            )}
          </div>

          {/* Error notice (optional) */}
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="h-20"></div>

      <BottomNavigation onProfileClick={() => setIsProfileModalOpen(true)} />

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSubmit={() => {}}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {isTicketModelOpen && selectedEvent && (
        <TicketPurchaseForm
          event={selectedEvent}
          onClose={() => {
            setIsTicketModelOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}