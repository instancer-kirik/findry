import { PublicBathroom, BathroomSearchParams, BathroomSearchResult, BathroomReview, BathroomIssueReport, UserLocation } from '@/types/bathroom-finder';

// Mock API service for bathroom finder
// In a real implementation, this would connect to actual APIs like:
// - Google Places API
// - Yelp API
// - Government open data APIs
// - Custom backend service

export class BathroomApiService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  // Search for bathrooms near a location
  static async searchBathrooms(params: BathroomSearchParams): Promise<BathroomSearchResult> {
    try {
      const queryParams = new URLSearchParams({
        q: params.query || '',
        lat: params.location?.lat.toString() || '',
        lng: params.location?.lng.toString() || '',
        type: params.filters.type,
        accessibility: params.filters.accessibility.toString(),
        babyChanging: params.filters.babyChanging.toString(),
        freeOnly: params.filters.freeOnly.toString(),
        openNow: params.filters.openNow.toString(),
        maxDistance: params.filters.maxDistance,
        sortBy: params.sortBy || 'distance',
        limit: params.limit?.toString() || '20',
        offset: params.offset?.toString() || '0',
      });

      const response = await fetch(`${this.baseUrl}/bathrooms/search?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching bathrooms:', error);
      // Return mock data for demonstration
      return this.getMockSearchResults(params);
    }
  }

  // Get bathroom details by ID
  static async getBathroomById(id: string): Promise<PublicBathroom | null> {
    try {
      const response = await fetch(`${this.baseUrl}/bathrooms/${id}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching bathroom:', error);
      return null;
    }
  }

  // Get reviews for a bathroom
  static async getBathroomReviews(bathroomId: string, limit: number = 10, offset: number = 0): Promise<BathroomReview[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/bathrooms/${bathroomId}/reviews?limit=${limit}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return this.getMockReviews(bathroomId);
    }
  }

  // Submit a new review
  static async submitReview(bathroomId: string, review: Omit<BathroomReview, 'id' | 'createdAt' | 'helpful' | 'notHelpful'>): Promise<BathroomReview> {
    try {
      const response = await fetch(`${this.baseUrl}/bathrooms/${bathroomId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  // Vote on a review (helpful/not helpful)
  static async voteOnReview(reviewId: string, vote: 'helpful' | 'not-helpful'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error voting on review:', error);
      throw error;
    }
  }

  // Report an issue with a bathroom
  static async reportIssue(report: Omit<BathroomIssueReport, 'id' | 'createdAt' | 'status'>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/bathrooms/${report.bathroomId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
      throw error;
    }
  }

  // Get user's current location using browser geolocation
  static async getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Upload photos for a review or report
  static async uploadPhotos(files: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`photo_${index}`, file);
      });

      const response = await fetch(`${this.baseUrl}/upload/photos`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.urls;
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw error;
    }
  }

  // Geocode an address to get coordinates
  static async geocodeAddress(address: string): Promise<UserLocation | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/geocode?address=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.location;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  // Get driving directions to a bathroom
  static async getDirections(from: UserLocation, to: UserLocation): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/directions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting directions:', error);
      throw error;
    }
  }

  // Mock data for demonstration purposes
  private static getMockSearchResults(params: BathroomSearchParams): BathroomSearchResult {
    const mockBathrooms: PublicBathroom[] = [
      {
        id: '1',
        name: 'Central Park Public Restrooms',
        address: '123 Park Ave, Downtown',
        latitude: 40.7829,
        longitude: -73.9654,
        type: 'park',
        rating: 4.2,
        reviews: 156,
        distance: 0.3,
        isOpen: true,
        hours: '6:00 AM - 10:00 PM',
        amenities: ['toilet_paper', 'soap', 'hand_dryer'],
        accessibility: true,
        baby_changing: true,
        free: true,
        verified: true,
        description: 'Clean, well-maintained public restrooms in the heart of downtown park.',
        cleanliness_rating: 4.0,
        safety_rating: 4.5,
      },
      // Add more mock data as needed
    ];

    return {
      bathrooms: mockBathrooms,
      total: mockBathrooms.length,
      hasMore: false,
      searchTime: 0.15,
    };
  }

  private static getMockReviews(bathroomId: string): BathroomReview[] {
    return [
      {
        id: '1',
        userId: 'user1',
        userName: 'Sarah M.',
        userAvatar: '',
        isVerified: true,
        rating: 4,
        cleanlinessRating: 4,
        safetyRating: 5,
        comment: 'Clean and well-maintained facility. Good lighting and feels safe.',
        photos: [],
        createdAt: new Date('2024-01-15'),
        helpful: 12,
        notHelpful: 1,
        tags: ['Clean', 'Safe area', 'Well maintained'],
        bathroomId,
      },
      // Add more mock reviews as needed
    ];
  }
}

// Helper functions for common operations
export const bathroomApiHelpers = {
  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  // Format distance for display
  formatDistance(miles: number): string {
    if (miles < 0.1) return '< 0.1 mi';
    if (miles < 1) return `${(miles * 5280).toFixed(0)} ft`;
    return `${miles.toFixed(1)} mi`;
  },

  // Check if bathroom is currently open based on hours
  isBathroomOpen(hours?: string): boolean {
    if (!hours) return false;
    if (hours.includes('24 hours') || hours.includes('24/7')) return true;

    // Simple parsing - in real implementation, use a proper time parsing library
    const now = new Date();
    const currentHour = now.getHours();

    // Basic pattern matching for "9:00 AM - 5:00 PM" format
    const timeMatch = hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return true; // Default to open if can't parse

    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = timeMatch;

    const startTime = this.convertTo24Hour(parseInt(startHour), parseInt(startMin), startPeriod);
    const endTime = this.convertTo24Hour(parseInt(endHour), parseInt(endMin), endPeriod);
    const currentTime = currentHour * 60 + now.getMinutes();

    return currentTime >= startTime && currentTime <= endTime;
  },

  convertTo24Hour(hour: number, minute: number, period: string): number {
    let hour24 = hour;
    if (period.toUpperCase() === 'PM' && hour !== 12) hour24 += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour24 = 0;
    return hour24 * 60 + minute;
  },

  // Validate coordinates
  isValidCoordinate(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },

  // Debounce function for search input
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  },
};
