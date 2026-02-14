import { getMockEvents } from './mockData';

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2';
const TM_KEY = process.env.NEXT_PUBLIC_TM_API_KEY;

function classifyVenue(venue) {
    const name = (venue?.name || '').toLowerCase();
    if (name.includes('festival') || name.includes('grounds')) return 'festival';
    if (name.includes('park') || name.includes('amphitheat') || name.includes('outdoor') || name.includes('garden')) return 'outdoor';
    if (name.includes('pub') || name.includes('bar') || name.includes('tavern') || name.includes('kneipe')) return 'pub';
    if (name.includes('club') || name.includes('lounge') || name.includes('disco')) return 'club';
    if (name.includes('arena') || name.includes('stadium') || name.includes('center') || name.includes('centre') || name.includes('hall') || name.includes('halle') || name.includes('philharmon')) return 'arena';
    return 'small';
}

function normalizeTMEvent(event) {
    const venue = event._embedded?.venues?.[0] || {};
    const attractions = event._embedded?.attractions || [];
    const images = event.images || [];
    const bestImage = [...images].sort((a, b) => (b.width || 0) - (a.width || 0))[0];

    return {
        id: event.id,
        name: event.name,
        artist: attractions[0]?.name || event.name,
        artistImage: attractions[0]?.images?.[0]?.url || null,
        genre: event.classifications?.[0]?.genre?.name || 'Music',
        subGenre: event.classifications?.[0]?.subGenre?.name || '',
        segment: event.classifications?.[0]?.segment?.name || '',
        date: event.dates?.start?.localDate || '',
        time: event.dates?.start?.localTime || '',
        timezone: event.dates?.timezone || '',
        status: event.dates?.status?.code || '',
        image: bestImage?.url || null,
        images: images.map(img => img.url),
        venue: {
            id: venue.id,
            name: venue.name || 'TBA',
            city: venue.city?.name || '',
            state: venue.state?.name || '',
            country: venue.country?.name || '',
            address: venue.address?.line1 || '',
            lat: parseFloat(venue.location?.latitude) || null,
            lng: parseFloat(venue.location?.longitude) || null,
            type: classifyVenue(venue),
        },
        priceRanges: event.priceRanges || [],
        ticketUrl: event.url || '#',
        seatmapUrl: event.seatmap?.staticUrl || null,
        info: event.info || event.pleaseNote || '',
        ageRestrictions: event.ageRestrictions?.legalAgeEnforced ? 'Age restricted' : null,
    };
}

export async function searchEvents({
    city,
    latLong,
    genre,
    dateRange,
    keyword,
    size = 20,
    page = 0,
} = {}) {
    // If no key is set at all, go straight to mock
    if (!TM_KEY) {
        console.warn('No API key found, using mock data');
        const mockEvents = getMockEvents({ city, genre, keyword, size });
        return {
            events: mockEvents,
            totalElements: mockEvents.length,
            totalPages: 1,
            isMock: true
        };
    }

    const params = new URLSearchParams();
    params.set('apikey', TM_KEY);
    params.set('size', size.toString());
    params.set('page', page.toString());
    params.set('sort', 'date,asc');
    params.set('classificationName', 'music');
    params.set('locale', '*');

    if (latLong) {
        params.set('latlong', latLong);
        params.set('radius', '50');
        params.set('unit', 'km');
    } else if (city) {
        params.set('city', city);
    }

    if (genre && genre !== 'all') {
        params.set('classificationName', genre);
    }

    if (keyword) {
        params.set('keyword', keyword);
    }

    try {
        const res = await fetch(`${TM_BASE}/events.json?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.fault?.faultstring || 'API Error');

        const events = (data._embedded?.events || []).map(normalizeTMEvent);
        const pageInfo = data.page || {};

        return {
            events,
            totalElements: pageInfo.totalElements || events.length,
            totalPages: pageInfo.totalPages || 1,
            isMock: false,
        };
    } catch (error) {
        console.warn('Ticketmaster API failed, falling back to mock data:', error);
        // FALLBACK: Use city-aware mock data logic
        const mockEvents = getMockEvents({ city, genre, keyword, size });
        return {
            events: mockEvents,
            totalElements: mockEvents.length,
            totalPages: 1,
            isMock: true,
            error: 'Network blocked API access — showing demo data'
        };
    }
}

export async function getEventById(id) {
    // Check if it's a mock ID
    if (id.startsWith('mock-')) {
        const mockEvents = getMockEvents({ size: 50 }); // generate enough to find it
        const event = mockEvents.find(e => e.id === id);
        if (event) return event;
        return mockEvents[0]; // fallback
    }

    if (!TM_KEY) return { error: 'No API key' };

    try {
        const res = await fetch(`${TM_BASE}/events/${id}.json?apikey=${TM_KEY}&locale=*`);
        if (!res.ok) throw new Error('Failed to fetch event');
        const event = await res.json();
        return normalizeTMEvent(event);
    } catch (error) {
        console.warn('API detail fetch failed', error);
        // Return a generic mock event as fallback
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
