import { getMockEvents } from './mockData';

const API_BASE = '/api/events';

export async function searchEvents({
    city,
    latLong,
    genre,
    dateRange,
    keyword,
    size = 20,
    page = 0,
} = {}) {
    const params = new URLSearchParams();
    params.set('size', size.toString());
    params.set('page', page.toString());

    // Pass filters to our own API route
    if (latLong) params.set('latlong', latLong);
    if (city) params.set('city', city);
    if (genre && genre !== 'all') params.set('genre', genre);
    if (keyword) params.set('keyword', keyword);
    if (dateRange) params.set('dateRange', dateRange);

    try {
        const res = await fetch(`${API_BASE}?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'API Error');

        return {
            events: data.events || [],
            totalElements: data.totalElements || 0,
            totalPages: data.totalPages || 0,
            isMock: data.isMock || false,
        };
    } catch (error) {
        console.warn('Backend API failed, falling back to mock data:', error);
        const mockEvents = getMockEvents({ city, genre, keyword, size });
        return {
            events: mockEvents,
            totalElements: mockEvents.length,
            totalPages: 1,
            isMock: true,
            error: 'Showing demo data (Network/API Error)'
        };
    }
}

export async function getEventById(id) {
    if (id.startsWith('mock-')) {
        const mockEvents = getMockEvents({ size: 50 });
        const event = mockEvents.find(e => e.id === id);
        return event || mockEvents[0];
    }

    try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error('Failed to fetch event');
        return await res.json();
    } catch (error) {
        console.warn('API detail fetch failed', error);
        const mockEvents = getMockEvents({ size: 1 });
        return mockEvents[0];
    }
}

export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    latLong: `${position.coords.latitude},${position.coords.longitude}`,
                });
            },
            (error) => {
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
    });
}

// Reverse geocode coordinates to a city name using the free Nominatim API
export async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data.address?.city
            || data.address?.town
            || data.address?.village
            || data.address?.county
            || data.address?.state
            || null;
    } catch {
        return null;
    }
}

export function getBestImage(images, minWidth = 500) {
    if (!images || images.length === 0) return null;
    const sorted = [...images].sort((a, b) => (b.width || 0) - (a.width || 0));
    const best = sorted.find(img => (img.width || 0) >= minWidth) || sorted[0];
    return best?.url || null;
}
