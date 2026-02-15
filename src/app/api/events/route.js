import { NextResponse } from 'next/server';
import { getDateRange } from '@/utils/constants';

const SKIDDLE_BASE = 'https://www.skiddle.com/api/v1/events/search';

function normalizeSkiddleEvent(event) {
    return {
        id: event.id,
        name: event.eventname,
        artist: event.artists?.[0]?.name || event.eventname,
        artistImage: event.artists?.[0]?.image || event.largeimageurl || null,
        genre: 'Live Music', // Skiddle 'LIVE'
        subGenre: event.items?.find(i => i.type === 'genre')?.name || '',
        segment: 'Music',
        date: event.date,
        time: event.openingtimes?.doorsopen || '19:00',
        timezone: '',
        status: 'onsale',
        image: event.largeimageurl || event.imageurl || null,
        images: [event.largeimageurl, event.imageurl].filter(Boolean),
        venue: {
            id: event.venue?.id,
            name: event.venue?.name || 'TBA',
            city: event.venue?.town || '',
            state: '',
            country: event.venue?.country || 'UK',
            address: event.venue?.address || '',
            lat: parseFloat(event.venue?.latitude) || null,
            lng: parseFloat(event.venue?.longitude) || null,
            type: classifyVenue(event.venue),
        },
        priceRanges: event.entryprice ? [{ min: 0, max: 0, currency: 'GBP', type: event.entryprice }] : [],
        ticketUrl: event.link || '#',
        seatmapUrl: null,
        info: event.description || '',
        ageRestrictions: event.minage ? `Min Age: ${event.minage}` : null,
    };
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const apiKey = process.env.SKIDDLE_API_KEY;

    // Must have a valid API key
    if (!apiKey || apiKey === 'REPLACE_ME') {
        console.error('Server: No Skiddle API key found');
        return NextResponse.json({
            events: [],
            totalElements: 0,
            totalPages: 0,
            error: 'No API key configured. Please add SKIDDLE_API_KEY to env.',
        });
    }

    const city = searchParams.get('city');
    const latlong = searchParams.get('latlong'); // "lat,long"
    const keyword = searchParams.get('keyword');
    const limit = searchParams.get('size') || '20';
    const offset = searchParams.get('page') ? parseInt(searchParams.get('page')) * parseInt(limit) : 0;

    const params = new URLSearchParams();
    params.set('api_key', apiKey);
    params.set('limit', limit);
    params.set('offset', offset.toString());
    params.set('order', 'date'); // Default sort
    params.set('description', '1'); // Get full description
    params.set('eventcode', 'LIVE'); // Default to LIVE music

    // Location handling
    if (latlong && latlong !== 'undefined' && latlong !== 'null') {
        const [lat, lng] = latlong.split(',');
        if (lat && lng) {
            params.set('latitude', lat);
            params.set('longitude', lng);
            params.set('radius', '10'); // Default 10 miles
            params.set('order', 'distance');
        }
    } else if (city && city !== 'undefined' && city !== 'null') {
        // Fallback to keyword search for city if no lat/long
        params.set('keyword', city);
    }

    if (keyword) {
        params.set('keyword', keyword);
    }

    const url = `${SKIDDLE_BASE}/?${params.toString()}`;
    console.log(`Server: Fetching Skiddle Data...`);

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error('Skiddle API Error:', data);
            return NextResponse.json({
                events: [],
                error: data.message || 'Skiddle API Error'
            });
        }

        const events = (data.results || []).map(normalizeSkiddleEvent);

        return NextResponse.json({
            events,
            totalElements: parseInt(data.totalcount) || events.length,
            totalPages: Math.ceil((parseInt(data.totalcount) || 0) / parseInt(limit)) || 1,
            isMock: false,
        });

    } catch (error) {
        console.error('Error fetching from Skiddle:', error);
        return NextResponse.json({
            events: [],
            error: 'Failed to fetch from Skiddle'
        });
    }
}


function classifyVenue(venue) {
    const name = (venue?.name || '').toLowerCase();
    const type = (venue?.type || '').toLowerCase();

    // Skiddle specific mapping if available, otherwise heuristics
    if (name.includes('festival') || name.includes('grounds')) return 'festival';
    if (name.includes('park') || name.includes('amphitheat') || name.includes('outdoor') || name.includes('garden')) return 'outdoor';
    if (name.includes('pub') || name.includes('bar') || name.includes('tavern') || name.includes('saloon') || name.includes('inn') || name.includes('arms')) return 'pub';
    if (name.includes('club') || name.includes('lounge') || name.includes('nightclub') || name.includes('warehouse')) return 'club';
    if (name.includes('arena') || name.includes('stadium') || name.includes('centre') || name.includes('center') || name.includes('hall') || name.includes('halle') || name.includes('academy')) return 'arena';
    return 'small';
}


