import { NextResponse } from 'next/server';
import { getDateRange } from '@/utils/constants';

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2';

function classifyVenue(venue) {
    const name = (venue?.name || '').toLowerCase();
    const type = (venue?.type || '').toLowerCase();
    const capacity = parseInt(venue?.upcomingEvents?._total) || 0;
    if (name.includes('festival') || name.includes('grounds')) return 'festival';
    if (name.includes('park') || name.includes('amphitheat') || name.includes('outdoor') || name.includes('garden')) return 'outdoor';
    if (name.includes('pub') || name.includes('bar') || name.includes('tavern') || name.includes('saloon')) return 'pub';
    if (name.includes('club') || name.includes('lounge')) return 'club';
    if (name.includes('arena') || name.includes('stadium') || name.includes('centre') || name.includes('center') || name.includes('hall') || name.includes('halle')) return 'arena';
    return 'small';
}

function normalizeTMEvent(event) {
    const venue = event._embedded?.venues?.[0] || {};
    const attractions = event._embedded?.attractions || [];
    const images = event.images || [];
    const bestImage = images.sort((a, b) => (b.width || 0) - (a.width || 0))[0];

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

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const apiKey = process.env.TICKETMASTER_API_KEY;

    const city = searchParams.get('city');
    const genre = searchParams.get('genre');
    const dateRange = searchParams.get('dateRange');
    const keyword = searchParams.get('keyword');
    const size = searchParams.get('size') || '20';
    const latlong = searchParams.get('latlong');

    // Must have a valid API key
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        console.error('Server: No API key found in environment variables');
        return NextResponse.json({
            events: [],
            totalElements: 0,
            totalPages: 0,
            error: 'No API key configured. Get your free key at https://developer-acct.ticketmaster.com/user/register and add it to .env.local as TICKETMASTER_API_KEY',
        });
    }

    console.log(`Server: Using API Key starting with ${apiKey.substring(0, 5)}...`);

    // ─── Build Ticketmaster query ───
    const params = new URLSearchParams();
    params.set('apikey', apiKey);
    params.set('size', size);
    params.set('page', searchParams.get('page') || '0');
    params.set('sort', 'date,asc');
    params.set('classificationName', 'music');
    params.set('locale', '*');

    // Location: prefer lat/long (GPS), then city name
    // Location: prefer lat/long (GPS), then city name
    if (latlong && latlong !== 'undefined' && latlong !== 'null') {
        params.set('latlong', latlong);
        params.set('radius', '50');
        params.set('unit', 'km');
    } else if (city && city !== 'undefined' && city !== 'null') {
        params.set('city', city);
    }

    // Genre filter
    if (genre && genre !== 'all') {
        params.set('classificationName', genre);
    }

    // Date range
    if (dateRange) {
        const range = getDateRange(dateRange);
        if (range) {
            params.set('startDateTime', range.startDateTime);
            params.set('endDateTime', range.endDateTime);
        }
    }

    // Keyword search
    if (keyword) {
        params.set('keyword', keyword);
    }

    try {
        const res = await fetch(`${TM_BASE}/events.json?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
            console.error('Ticketmaster API error:', data);
            return NextResponse.json({
                events: [],
                totalElements: 0,
                error: data?.fault?.faultstring || 'API error — check your key',
            });
        }

        const events = (data._embedded?.events || []).map(normalizeTMEvent);
        const page = data.page || {};

        return NextResponse.json({
            events,
            totalElements: page.totalElements || events.length,
            totalPages: page.totalPages || 1,
            isMock: false,
        });
    } catch (error) {
        console.error('Ticketmaster API Error:', error);
        return NextResponse.json({
            events: [],
            totalElements: 0,
            error: 'Failed to reach Ticketmaster API',
        });
    }
}
