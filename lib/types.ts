export interface Event {
  id: number
  eventName: string
  eventDescription: string
  eventLocation: string
  eventDateAndTime: string
  availableSeats: number
  bookedSeats: number
  ticketPrices: number
  createdAt: string
  updatedAt: string
  EventDuration: string | null
  EventCategory: string | null
  // Computed properties for UI
  imageUrl?: string | null
  category?: string
  location?: string
  title?: string
  subtitle?: string
}

export interface Ticket  {
  id: number;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  userId: number;
  price: number;
  qrCodeId: number;

  event: {
    id: number;
    eventName: string;
    eventDescription: string | null;
    eventLocation: string;
    eventDateAndTime: string;
    availableSeats: number;
    bookedSeats: number;
    ticketPrices: number;
    createdAt: string;
    updatedAt: string;
    EventDuration: string | null;
    EventCategory: string | null;
    imageUrl: string;
  };
  user: {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    googleId?: string;
  };
    qr: string;
};

export type User  ={
  id: number;
  name: string;
  email: string;
  googleId?: string;
  // add any other fields your API returns
} 

export interface FeaturedEvent extends Event {
  featured: boolean
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  total?: number
}

export interface EventsResponse {
  featuredEvents: Event[]
  events: Event[]
  totalCount?: number
}

export type CategoryType = 'music' | 'sports' | 'culture' | 'food' | 'workshop' | 'tech' | 'conference' | 'all'