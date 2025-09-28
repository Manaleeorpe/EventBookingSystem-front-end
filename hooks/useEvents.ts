import { useState, useEffect, useCallback } from 'react';
import { EventsResponse, CategoryType } from '@/lib/types';
import { apiClient } from '@/lib/api';

export function useEvents() {
  const [data, setData] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Always fetch ALL events for the regular section
      const allResponse = await apiClient.getEvents({
        search: searchQuery || undefined,
      });

      let featuredEventsResponse: EventsResponse;

      if (category !== 'all') {
        // ✅ fetch by category + search
        featuredEventsResponse = await apiClient.getEvents({
          category,
          search: searchQuery || undefined,
        });
      } else {
        // ✅ respect search here too
        featuredEventsResponse = {
          ...allResponse,
          featuredEvents: allResponse.events.slice(0, 5),
          events: [],
          totalCount: allResponse.totalCount,
        };
      }

      // Combine into final data shape
      setData({
        featuredEvents: featuredEventsResponse.featuredEvents,
        events: allResponse.events, // always ALL for regular section
        totalCount: allResponse.totalCount,
      });
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [category, searchQuery]);

  const searchEvents = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    data,
    loading,
    error,
    category,
    setCategory,
    searchEvents,
  };
}