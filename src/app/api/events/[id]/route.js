import { NextResponse } from 'next/server';

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2';

function classifyVenue(venue) {
    const name = (venue?.name || '').toLowerCase();
    if (name.includes('festival') || name.includes('grounds')) return 'festival';
    if (name.includes('park') || name.includes('amphitheat') || name.includes('outdoor')) return 'outdoor';
    if (name.includes('pub') || name.includes('bar') || name.includes('tavern')) return 'pub';
    if (name.includes('club') || name.includes('lounge')) return 'club';
    if (name.includes('arena') || name.includes('stadium') || name.includes('center') || name.includes('hall') || name.includes('halle')) return 'arena';
    return 'small';
}

export async function GET(request, { params }) {
    const { id } = await params;
    const apiKey = process.env.TICKETMASTER_API_KEY;

    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
        return NextResponse.json({
            error: 'No API key configured. Get your free key at https://developer-acct.ticketmaster.com/user/register',
        }, { status: 401 });
    }

    try {
        const res = await fetch(`${TM_BASE}/events/${id}.json?apikey=${apiKey}&locale=*`);
        const event = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const venue = event._embedded?.venues?.[0] || {};
        const attractions = event._embedded?.attractions || [];
        const images = event.images || [];
        const bestImage = images.sort((a, b) => (b.width || 0) - (a.width || 0))[0];

        return NextResponse.json({
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
                generalInfo: venue.generalInfo || null,
                parkingDetail: venue.parkingDetail || null,
            },
            priceRanges: event.priceRanges || [],
            ticketUrl: event.url || '',
            seatmapUrl: event.seatmap?.staticUrl || null,
            info: event.info || '',
            pleaseNote: event.pleaseNote || '',
            ageRestrictions: event.ageRestrictions?.legalAgeEnforced ? 'Age restricted' : null,
            accessibility: event.accessibility || null,
            isMock: false,
        });
    } catch (error) {
        console.error('Event Detail Error:', error);
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }
}
