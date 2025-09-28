import { Event, EventsResponse } from './types';

// Replace with your actual API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Build the URL properly - don't hardcode /events
    let url = `${API_BASE_URL}`;
    
    // Add leading slash to endpoint if needed
    if (!url.endsWith('/') && !endpoint.startsWith('/')) {
      url += '/';
    }
    url += endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    
    console.log('🚀 API Request URL:', url);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - URL: ${url}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error; // Re-throw to let the calling function handle it
    }
  }

  async getEventsByCategory(category: string): Promise<EventsResponse> {
  try {
    const events = await this.request<Event[]>(`events/${category}`);

    const transformedEvents = events.map((event) =>
      this.transformEvent(event)
    );

    return {
      featuredEvents: transformedEvents.slice(0, 3),
      events: transformedEvents.slice(3),
      totalCount: transformedEvents.length,
    };
  } catch (error) {
    console.error(`Failed to fetch events for category ${category}:`, error);
    return {
      featuredEvents: [],
      events: [],
      totalCount: 0,
    };
  }
}

  // Transform API event data to UI format
  private transformEvent(event: Event): Event {
    return {
      ...event,
      eventName: event.eventName,
      eventDescription: event.eventDescription?.substring(0, 50) + '...' || '',
      eventLocation: event.eventLocation,
      EventCategory: event.EventCategory?.toLowerCase() || 'general',
      imageUrl:  event.imageUrl//this.getEventImage(event.EventCategory, event.id),
    };
  }

  private getEventImage(category: string | null, eventId: number): string {
    const categoryImages = {
      tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      conference: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400',
      music: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      sports: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
      culture: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
      food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      workshop: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400'
    };
    
    return categoryImages[category?.toLowerCase() as keyof typeof categoryImages] || 
           'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400';
  }

  // Get all events with optional filters
  async getEvents(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
    featured?: boolean;
  }): Promise<EventsResponse> {
    try {
      // Build endpoint with query parameters
      let endpoint = 'events';
      
      if (params) {
        const queryParams = new URLSearchParams();
        
        if (params.category && params.category !== 'all') {
          queryParams.append('category', params.category);
        }
        
        if (params.search) {
          queryParams.append('search', params.search);
        }
        
        if (params.limit) {
          queryParams.append('limit', params.limit.toString());
        }
        
        if (params.page) {
          queryParams.append('page', params.page.toString());
        }
        
        if (params.featured) {
          queryParams.append('featured', 'true');
        }
        
        const queryString = queryParams.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }
      }
      
      // Fetch events from API
      const events = await this.request<Event[]>(endpoint);
      
      console.log('🔍 RAW API Response:', JSON.stringify(events, null, 2));
      
      // Transform the events for UI
      const transformedEvents = events.map(event => this.transformEvent(event));
      
      // Split into featured and regular events
      const featuredEvents = transformedEvents.slice(0, 3); // First 3 as featured
      const regularEvents = transformedEvents.slice(3); // Rest as regular
      
      return {
        featuredEvents,
        events: regularEvents,
        totalCount: transformedEvents.length
      };
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Return empty response on error
      return {
        featuredEvents: [],
        events: [],
        totalCount: 0
      };
    }
  }

  async getFeaturedEvents(): Promise<Event[]> {
    try {
      // You might want to use a specific endpoint for featured events
      // Or add a query parameter, like: 'events?featured=true'
      const events = await this.request<Event[]>('events');
      return events.slice(0, 5).map(event => this.transformEvent(event));
    } catch (error) {
      console.error('Failed to fetch featured events:', error);
      return [];
    }
  }

  async getEvent(id: number): Promise<Event | null> {
    try {
      const response = await this.request<Event>(`events/${id}`);
      return this.transformEvent(response);
    } catch (error) {
      console.error(`Failed to fetch event ${id}:`, error);
      return null;
    }
  }
}

export const apiClient = new ApiClient();