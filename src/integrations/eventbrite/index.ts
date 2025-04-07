// Eventbrite Integration

// API endpoint and constants
const EVENTBRITE_API_BASE_URL = 'https://www.eventbriteapi.com/v3';
const EVENTBRITE_OAUTH_URL = 'https://www.eventbrite.com/oauth/authorize';
const EVENTBRITE_TOKEN_URL = 'https://www.eventbrite.com/oauth/token';

// Environment variables
const EVENTBRITE_API_KEY = import.meta.env.VITE_EVENTBRITE_API_KEY || '';
const EVENTBRITE_CLIENT_ID = import.meta.env.VITE_EVENTBRITE_CLIENT_ID || '';
const EVENTBRITE_CLIENT_SECRET = import.meta.env.VITE_EVENTBRITE_CLIENT_SECRET || '';
const EVENTBRITE_REDIRECT_URI = import.meta.env.VITE_EVENTBRITE_REDIRECT_URI || window.location.origin + '/eventbrite/callback';

// Types
export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description: {
    text: string;
    html: string;
  };
  url: string;
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  organization_id: string;
  created: string;
  changed: string;
  published: string;
  capacity: number;
  capacity_is_custom: boolean;
  status: string;
  currency: string;
  listed: boolean;
  shareable: boolean;
  online_event: boolean;
  tx_time_limit: number;
  hide_start_date: boolean;
  hide_end_date: boolean;
  locale: string;
  is_locked: boolean;
  privacy_setting: string;
  is_series: boolean;
  is_series_parent: boolean;
  inventory_type: string;
  is_reserved_seating: boolean;
  show_pick_a_seat: boolean;
  show_seatmap_thumbnail: boolean;
  show_colors_in_seatmap_thumbnail: boolean;
  source: string;
  is_free: boolean;
  version: string;
  summary: string;
  logo_id: string;
  organizer_id: string;
  venue_id: string;
  category_id: string;
  subcategory_id: string;
  format_id: string;
  resource_uri: string;
  is_externally_ticketed: boolean;
  venue: EventbriteVenue;
  logo: {
    crop_mask: {
      top_left: {
        x: number;
        y: number;
      };
      width: number;
      height: number;
    };
    original: {
      url: string;
      width: number;
      height: number;
    };
    id: string;
    url: string;
    aspect_ratio: string;
    edge_color: string;
    edge_color_set: boolean;
  };
}

export interface EventbriteVenue {
  address: {
    address_1: string;
    address_2: string;
    city: string;
    region: string;
    postal_code: string;
    country: string;
    latitude: string;
    longitude: string;
    localized_address_display: string;
    localized_area_display: string;
    localized_multi_line_address_display: string[];
  };
  resource_uri: string;
  id: string;
  name: string;
  latitude: string;
  longitude: string;
}

export interface EventbriteOrganizer {
  description: {
    text: string;
    html: string;
  };
  id: string;
  name: string;
  url: string;
  logo_id: string;
  logo: {
    id: string;
    url: string;
  }
}

export interface EventbritePaginatedResponse<T> {
  pagination: {
    object_count: number;
    page_number: number;
    page_size: number;
    page_count: number;
    has_more_items: boolean;
  };
  events?: T[];
  venues?: T[];
  organizers?: T[];
}

// Functions
export async function getEventbriteAuthUrl(state: string = ''): Promise<string> {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: EVENTBRITE_CLIENT_ID,
    redirect_uri: EVENTBRITE_REDIRECT_URI,
  });
  
  if (state) params.append('state', state);
  
  return `${EVENTBRITE_OAUTH_URL}?${params.toString()}`;
}

export async function getEventbriteAccessToken(code: string): Promise<string | null> {
  try {
    const response = await fetch(EVENTBRITE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: EVENTBRITE_CLIENT_ID,
        client_secret: EVENTBRITE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: EVENTBRITE_REDIRECT_URI,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Eventbrite access token:', error);
    return null;
  }
}

// API functions with token
export async function fetchEventbriteEvents(token: string, organizationId?: string): Promise<EventbriteEvent[]> {
  try {
    const url = organizationId 
      ? `${EVENTBRITE_API_BASE_URL}/organizations/${organizationId}/events/` 
      : `${EVENTBRITE_API_BASE_URL}/users/me/events/`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data: EventbritePaginatedResponse<EventbriteEvent> = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching Eventbrite events:', error);
    return [];
  }
}

export async function fetchEventbriteEvent(token: string, eventId: string): Promise<EventbriteEvent | null> {
  try {
    const response = await fetch(`${EVENTBRITE_API_BASE_URL}/events/${eventId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching Eventbrite event ${eventId}:`, error);
    return null;
  }
}

export async function createEventbriteEvent(token: string, eventData: Partial<EventbriteEvent>): Promise<EventbriteEvent | null> {
  try {
    const response = await fetch(`${EVENTBRITE_API_BASE_URL}/events/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Eventbrite event:', error);
    return null;
  }
}

export async function syncEventToEventbrite(
  token: string, 
  event: {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    is_online: boolean;
    capacity: number;
    organizer_id?: string;
  }
): Promise<{ success: boolean; eventbriteId?: string; error?: string }> {
  try {
    // Format event data for Eventbrite API
    const eventbriteData = {
      event: {
        name: {
          html: event.title
        },
        description: {
          html: event.description
        },
        start: {
          timezone: 'UTC',
          utc: new Date(event.start_date).toISOString()
        },
        end: {
          timezone: 'UTC',
          utc: new Date(event.end_date).toISOString()
        },
        currency: 'USD',
        online_event: event.is_online,
        capacity: event.capacity,
        organizer_id: event.organizer_id,
        listed: true
      }
    };

    const response = await fetch(`${EVENTBRITE_API_BASE_URL}/events/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventbriteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error_description || 'Failed to sync event to Eventbrite');
    }

    const data = await response.json();
    return {
      success: true,
      eventbriteId: data.id
    };
  } catch (error) {
    console.error('Error syncing event to Eventbrite:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Mock data for development purposes
const useMockData = true;

export const mockEventbriteEvents: EventbriteEvent[] = [
  {
    id: 'eb-123456789',
    name: {
      text: 'Findry Creators Showcase',
      html: '<p>Findry Creators Showcase</p>'
    },
    description: {
      text: 'Join us for an evening showcasing the best creative work from the Findry community. Meet artists, designers, and creators while enjoying live performances and exhibitions.',
      html: '<p>Join us for an evening showcasing the best creative work from the Findry community. Meet artists, designers, and creators while enjoying live performances and exhibitions.</p>'
    },
    url: 'https://www.eventbrite.com/e/findry-creators-showcase-tickets-123456789',
    start: {
      timezone: 'America/Los_Angeles',
      local: '2023-09-15T18:00:00',
      utc: '2023-09-16T01:00:00Z'
    },
    end: {
      timezone: 'America/Los_Angeles',
      local: '2023-09-15T21:00:00',
      utc: '2023-09-16T04:00:00Z'
    },
    organization_id: 'org-123456',
    created: '2023-08-01T15:00:00Z',
    changed: '2023-08-02T10:00:00Z',
    published: '2023-08-02T10:00:00Z',
    capacity: 150,
    capacity_is_custom: true,
    status: 'live',
    currency: 'USD',
    listed: true,
    shareable: true,
    online_event: false,
    tx_time_limit: 480,
    hide_start_date: false,
    hide_end_date: false,
    locale: 'en_US',
    is_locked: false,
    privacy_setting: 'unlocked',
    is_series: false,
    is_series_parent: false,
    inventory_type: 'limited',
    is_reserved_seating: false,
    show_pick_a_seat: false,
    show_seatmap_thumbnail: false,
    show_colors_in_seatmap_thumbnail: false,
    source: 'create_event',
    is_free: true,
    version: '3.0.0',
    summary: 'Findry Creators Showcase',
    logo_id: 'logo-123456',
    organizer_id: 'org-123456',
    venue_id: 'venue-123456',
    category_id: 'cat-123456',
    subcategory_id: 'subcat-123456',
    format_id: 'format-123456',
    resource_uri: 'https://www.eventbriteapi.com/v3/events/123456789/',
    is_externally_ticketed: false,
    venue: {
      address: {
        address_1: '123 Creator Ave',
        address_2: 'Suite 200',
        city: 'San Francisco',
        region: 'CA',
        postal_code: '94107',
        country: 'US',
        latitude: '37.7749',
        longitude: '-122.4194',
        localized_address_display: '123 Creator Ave, San Francisco, CA 94107',
        localized_area_display: 'San Francisco, CA',
        localized_multi_line_address_display: [
          '123 Creator Ave',
          'Suite 200',
          'San Francisco, CA 94107'
        ]
      },
      resource_uri: 'https://www.eventbriteapi.com/v3/venues/venue-123456/',
      id: 'venue-123456',
      name: 'Findry Creative Space',
      latitude: '37.7749',
      longitude: '-122.4194'
    },
    logo: {
      crop_mask: {
        top_left: {
          x: 0,
          y: 0
        },
        width: 500,
        height: 250
      },
      original: {
        url: 'https://img.evbuc.com/logo-123456.jpg',
        width: 800,
        height: 400
      },
      id: 'logo-123456',
      url: 'https://img.evbuc.com/logo-123456.jpg',
      aspect_ratio: '2',
      edge_color: '#ffffff',
      edge_color_set: true
    }
  },
  {
    id: 'eb-987654321',
    name: {
      text: 'Digital Art Workshop Series',
      html: '<p>Digital Art Workshop Series</p>'
    },
    description: {
      text: 'A series of workshops teaching digital art techniques using popular software and tablets. Perfect for beginners and intermediate artists looking to expand their skills.',
      html: '<p>A series of workshops teaching digital art techniques using popular software and tablets. Perfect for beginners and intermediate artists looking to expand their skills.</p>'
    },
    url: 'https://www.eventbrite.com/e/digital-art-workshop-series-tickets-987654321',
    start: {
      timezone: 'America/New_York',
      local: '2023-10-10T10:00:00',
      utc: '2023-10-10T14:00:00Z'
    },
    end: {
      timezone: 'America/New_York',
      local: '2023-10-10T16:00:00',
      utc: '2023-10-10T20:00:00Z'
    },
    organization_id: 'org-123456',
    created: '2023-08-15T12:00:00Z',
    changed: '2023-08-16T09:30:00Z',
    published: '2023-08-16T10:00:00Z',
    capacity: 50,
    capacity_is_custom: true,
    status: 'live',
    currency: 'USD',
    listed: true,
    shareable: true,
    online_event: true,
    tx_time_limit: 480,
    hide_start_date: false,
    hide_end_date: false,
    locale: 'en_US',
    is_locked: false,
    privacy_setting: 'unlocked',
    is_series: true,
    is_series_parent: true,
    inventory_type: 'limited',
    is_reserved_seating: false,
    show_pick_a_seat: false,
    show_seatmap_thumbnail: false,
    show_colors_in_seatmap_thumbnail: false,
    source: 'create_event',
    is_free: false,
    version: '3.0.0',
    summary: 'Digital Art Workshop Series',
    logo_id: 'logo-654321',
    organizer_id: 'org-123456',
    venue_id: 'venue-654321',
    category_id: 'cat-123456',
    subcategory_id: 'subcat-123456',
    format_id: 'format-123456',
    resource_uri: 'https://www.eventbriteapi.com/v3/events/987654321/',
    is_externally_ticketed: false,
    venue: {
      address: {
        address_1: 'Online Event',
        address_2: '',
        city: '',
        region: '',
        postal_code: '',
        country: 'US',
        latitude: '',
        longitude: '',
        localized_address_display: 'Online Event',
        localized_area_display: 'Online',
        localized_multi_line_address_display: [
          'Online Event'
        ]
      },
      resource_uri: 'https://www.eventbriteapi.com/v3/venues/venue-654321/',
      id: 'venue-654321',
      name: 'Online Event',
      latitude: '',
      longitude: ''
    },
    logo: {
      crop_mask: {
        top_left: {
          x: 0,
          y: 0
        },
        width: 500,
        height: 250
      },
      original: {
        url: 'https://img.evbuc.com/logo-654321.jpg',
        width: 800,
        height: 400
      },
      id: 'logo-654321',
      url: 'https://img.evbuc.com/logo-654321.jpg',
      aspect_ratio: '2',
      edge_color: '#000000',
      edge_color_set: true
    }
  }
];

// Mock convenience functions
export const getEventbriteEvents = async (token?: string): Promise<EventbriteEvent[]> => {
  if (useMockData || !token) {
    return mockEventbriteEvents;
  }
  return fetchEventbriteEvents(token);
};

export const getEventbriteEvent = async (eventId: string, token?: string): Promise<EventbriteEvent | null> => {
  if (useMockData || !token) {
    return mockEventbriteEvents.find(event => event.id === eventId) || null;
  }
  if (!token) return null;
  return fetchEventbriteEvent(token, eventId);
};

// Helper function to convert Eventbrite event to application event format
export const convertEventbriteToAppEvent = (eventbriteEvent: EventbriteEvent) => {
  return {
    id: eventbriteEvent.id,
    title: eventbriteEvent.name.text,
    description: eventbriteEvent.description.text,
    location: eventbriteEvent.online_event 
      ? 'Online' 
      : eventbriteEvent.venue?.name || '',
    start_date: eventbriteEvent.start.utc,
    end_date: eventbriteEvent.end.utc,
    poster_url: eventbriteEvent.logo?.url || '',
    capacity: eventbriteEvent.capacity,
    event_type: eventbriteEvent.online_event ? 'online' : 'in-person',
    eventbrite_url: eventbriteEvent.url
  };
}; 