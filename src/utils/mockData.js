const GENRE_IMAGES = {
    Rock: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&h=400&fit=crop',
    Metal: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
    Pop: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=400&fit=crop',
    'Hip-Hop': 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&h=400&fit=crop',
    Electronic: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&h=400&fit=crop',
    Techno: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop',
    Indie: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=400&fit=crop',
    Jazz: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop',
    'R&B': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    Classical: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop',
    Folk: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop',
    Country: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
    Latin: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop',
};

// Real venue databases per city
const CITY_VENUES = {
    'London': { arena: ['The O2', 'Wembley Arena', 'Alexandra Palace', 'Royal Albert Hall'], club: ['Fabric', 'Ministry of Sound', 'XOYO', 'Printworks'], pub: ['The Dublin Castle', 'The Half Moon Putney', "Ain't Nothin But Blues Bar"], small: ['Bush Hall', 'Islington Assembly Hall', 'Village Underground'], festival: ['Hyde Park', 'Victoria Park', 'Finsbury Park'], outdoor: ['Gunnersbury Park', 'Crystal Palace Park'] },
    'Berlin': { arena: ['Mercedes-Benz Arena', 'Velodrom', 'Columbiahalle', 'Tempodrom'], club: ['Berghain', 'Tresor', 'Watergate', 'KitKatClub'], pub: ['Madame Claude', 'Schokoladen', 'Bassy Cowboy Club'], small: ['Lido', 'Bi Nuu', 'Frannz Club'], festival: ['Lollapalooza Berlin', 'Tempelhof Feld'], outdoor: ['Waldbühne', 'Zitadelle Spandau'] },
    'New York': { arena: ['Madison Square Garden', 'Barclays Center', 'Radio City Music Hall', 'Beacon Theatre'], club: ['Elsewhere', 'Output', 'Good Room', 'Le Bain'], pub: ['Rockwood Music Hall', 'Bowery Electric', 'Arlene\'s Grocery'], small: ['Bowery Ballroom', 'Webster Hall', 'Mercury Lounge'], festival: ['Governors Ball', 'Central Park SummerStage'], outdoor: ['Forest Hills Stadium', 'Prospect Park Bandshell'] },
    'Paris': { arena: ['Accor Arena', 'Zénith Paris', 'Olympia', 'La Cigale'], club: ['Rex Club', 'Concrete', 'Badaboum', 'Le Nouveau Casino'], pub: ['Le Sunset', 'Le Baiser Salé', 'Au Lapin Agile'], small: ['La Maroquinerie', 'Le Trabendo', 'Le Bataclan'], festival: ['Rock en Seine', 'We Love Green'], outdoor: ['Parc des Princes', 'Jardin du Luxembourg'] },
    'Amsterdam': { arena: ['Ziggo Dome', 'AFAS Live', 'Paradiso', 'Melkweg'], club: ['De School', 'Shelter', 'Claire', 'AIR'], pub: ['Bourbon Street', 'Café Alto', 'Maloe Melo'], small: ['Tolhuistuin', 'Bitterzoet', 'Occii'], festival: ['Dekmantel', 'DGTL', 'Loveland'], outdoor: ['Vondelpark Openluchttheater'] },
    'Manchester': { arena: ['AO Arena', 'Victoria Hall', 'Albert Hall Manchester'], club: ['Warehouse Project', 'Hidden', 'YES Manchester'], pub: ['The Castle Hotel', 'Gullivers', 'Night & Day Café'], small: ['Band on the Wall', 'Gorilla', 'Academy 3'], festival: ['Parklife', 'Sounds of the City'], outdoor: ['Castlefield Bowl', 'Heaton Park'] },
    'Barcelona': { arena: ['Palau Sant Jordi', 'Razzmatazz', 'Sant Jordi Club'], club: ['Moog', 'Nitsa', 'Input High Fidelity Dance Club'], pub: ['JazzSí Club', 'Harlem Jazz Club', 'Sala Monasterio'], small: ['Sidecar', 'Sala Apolo', 'La Nau'], festival: ['Primavera Sound', 'Sónar', 'Cruïlla'], outdoor: ['Parc del Fòrum', 'Poble Espanyol'] },
    'Essen': { arena: ['Grugahalle', 'Colosseum Theater', 'Lichtburg'], club: ['Goethebunker', 'Zeche Carl', 'Hotel Shanghai'], pub: ['Fön Club', 'Kulturzentrum Grend', 'Café Central'], small: ['Weststadthalle', 'Zeche Zollverein Halle 5', 'Stratmanns Theater'], festival: ['Essen Original', 'Werden Open Air', 'Borbecker Sommerpark'], outdoor: ['Grugapark Freilichtbühne', 'Baldeneysee Open Air'] },
    'Düsseldorf': { arena: ['Mitsubishi Electric Halle', 'ISS Dome', 'Capitol Theater'], club: ['Salon des Amateurs', 'Sub', 'Nachtresidenz'], pub: ['The Jazz Schmiede', 'Stone im Ratinger Hof', 'Pitcher'], small: ['Zakk', 'FFT Juta', 'Stahlwerk'], festival: ['Open Source Festival'], outdoor: ['Rheinpark', 'Tonhalle'] },
    'Munich': { arena: ['Olympiahalle', 'Zenith', 'Muffathalle', 'Circus Krone'], club: ['Harry Klein', 'Blitz Club', 'Rote Sonne'], pub: ['Jazzbar Vogler', 'Atomic Café', 'Strom'], small: ['Backstage', 'Feierwerk', 'Ampere'], festival: ['Tollwood', 'Oben Ohne'], outdoor: ['Königsplatz', 'Olympiapark'] },
    'Hamburg': { arena: ['Barclays Arena', 'Mehr! Theater', 'Laeiszhalle'], club: ['Übel & Gefährlich', 'PAL', 'Golden Pudel Club'], pub: ['Molotow', 'Gruenspan', 'Hafenklang'], small: ['Knust', 'Fabrik', 'Logo'], festival: ['Reeperbahn Festival', 'MS Dockville'], outdoor: ['Stadtpark Freilichtbühne', 'Elbphilharmonie Plaza'] },
    'Frankfurt': { arena: ['Festhalle Frankfurt', 'Jahrhunderthalle', 'Alte Oper'], club: ['Robert Johnson', 'Tanzhaus West', 'Gibson'], pub: ['Jazzkeller', 'Club Voltaire', 'Cave 54'], small: ['Batschkapp', 'Zoom', 'Das Bett'], festival: ['Museumsuferfest', 'World Club Dome'], outdoor: ['Rebstockpark', 'Waldstadion'] },
    'Cologne': { arena: ['Lanxess Arena', 'Palladium', 'E-Werk'], club: ['Bootshaus', 'Odonien', 'Gewölbe'], pub: ['Papa Joe\'s Jazz Lokal', 'Sonic Ballroom', 'Stereo Wonderland'], small: ['Gloria Theater', 'Live Music Hall', 'Luxor'], festival: ['Summerjam', 'c/o pop'], outdoor: ['Tanzbrunnen', 'Fühlinger See'] },
};

function getVenuesForCity(cityName) {
    const c = cityName || 'London';
    for (const [key, venues] of Object.entries(CITY_VENUES)) {
        if (key.toLowerCase() === c.toLowerCase()) return venues;
    }
    return {
        arena: [`${c} Arena`, `${c} Concert Hall`, `${c} Civic Center`],
        club: [`Club ${c}`, `The Underground ${c}`, `Basement ${c}`],
        pub: [`The ${c} Arms`, `${c} Music Bar`, `The Corner Pub`],
        small: [`${c} Music Room`, `The Loft ${c}`, `${c} Studio`],
        festival: [`${c} Summer Festival`, `${c} Music Fest`],
        outdoor: [`${c} City Park Stage`, `${c} Open Air`],
    };
}

const EVENT_TEMPLATES = [
    { name: 'Neon Pulse Festival', artist: 'Various Artists', genre: 'Electronic', venueType: 'festival', priceMin: 45, priceMax: 120 },
    { name: 'Midnight Jazz Sessions', artist: 'The Blue Notes Quartet', genre: 'Jazz', venueType: 'pub', priceMin: 15, priceMax: 15 },
    { name: 'Arctic Waves Tour', artist: 'Arctic Monkeys', genre: 'Rock', venueType: 'arena', priceMin: 65, priceMax: 180 },
    { name: 'Deep Underground', artist: 'Richie Hawtin', genre: 'Techno', venueType: 'club', priceMin: 25, priceMax: 25 },
    { name: 'Indie Unplugged', artist: 'Phoebe Bridgers', genre: 'Indie', venueType: 'small', priceMin: 35, priceMax: 55 },
    { name: 'Bass Nation Takeover', artist: 'Skrillex', genre: 'Electronic', venueType: 'arena', priceMin: 70, priceMax: 200 },
    { name: 'Summer Metal Madness', artist: 'Gojira', genre: 'Metal', venueType: 'festival', priceMin: 80, priceMax: 250 },
    { name: 'Hip-Hop Hooray', artist: 'Kendrick Lamar', genre: 'Hip-Hop', venueType: 'arena', priceMin: 55, priceMax: 150 },
    { name: 'Acoustic Corner', artist: 'Iron & Wine', genre: 'Folk', venueType: 'pub', priceMin: 12, priceMax: 12 },
    { name: 'Pop Spectacular', artist: 'Dua Lipa', genre: 'Pop', venueType: 'arena', priceMin: 75, priceMax: 250 },
    { name: 'Latin Nights', artist: 'Bad Bunny', genre: 'Latin', venueType: 'arena', priceMin: 60, priceMax: 200 },
    { name: 'Classical Reborn', artist: 'City Philharmonic', genre: 'Classical', venueType: 'arena', priceMin: 30, priceMax: 90 },
    { name: 'R&B Slow Jams', artist: 'SZA', genre: 'R&B', venueType: 'arena', priceMin: 55, priceMax: 130 },
    { name: 'Punk in the Park', artist: 'IDLES', genre: 'Rock', venueType: 'outdoor', priceMin: 40, priceMax: 40 },
    { name: 'Country Roads Live', artist: 'Kacey Musgraves', genre: 'Country', venueType: 'small', priceMin: 35, priceMax: 70 },
    { name: 'Open Mic Mayhem', artist: 'Various Local Artists', genre: 'Indie', venueType: 'pub', priceMin: 0, priceMax: 0 },
    { name: 'Warehouse Rave', artist: 'Charlotte de Witte', genre: 'Techno', venueType: 'club', priceMin: 30, priceMax: 30 },
    { name: 'Starlight World Tour', artist: 'Billie Eilish', genre: 'Pop', venueType: 'arena', priceMin: 70, priceMax: 280 },
    { name: 'Blues at the Bar', artist: 'Gary Clark Jr.', genre: 'Rock', venueType: 'pub', priceMin: 18, priceMax: 18 },
    { name: 'Vinyl Sessions', artist: 'DJ Shadow', genre: 'Electronic', venueType: 'club', priceMin: 20, priceMax: 20 },
];

export function getMockEvents(params = {}) {
    const { city, genre, keyword, size = 20 } = params;
    const cityName = city || 'London';
    const cityVenues = getVenuesForCity(cityName);

    // Deterministic shuffle based on city code
    const seed = cityName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

    let templates = [...EVENT_TEMPLATES];
    // Simple deterministic shuffle
    templates.sort((a, b) => ((a.name.length + seed) % 10) - ((b.name.length + seed) % 10));

    if (genre && genre !== 'all') {
        templates = templates.filter(t => t.genre.toLowerCase() === genre.toLowerCase());
    }
    if (keyword) {
        const kw = keyword.toLowerCase();
        templates = templates.filter(t =>
            t.name.toLowerCase().includes(kw) ||
            t.artist.toLowerCase().includes(kw) ||
            t.genre.toLowerCase().includes(kw)
        );
    }

    const now = new Date();

    return templates.slice(0, parseInt(size)).map((m, i) => {
        const eventDate = new Date(now);
        eventDate.setDate(eventDate.getDate() + (i % 14)); // Spread over 2 weeks
        const hour = 18 + (i % 5);

        // Pick venue from city list
        const venueList = cityVenues[m.venueType] || cityVenues.arena || [`${cityName} Venue`];
        const venueName = venueList[(i + seed) % venueList.length];

        return {
            id: `mock-${i}`,
            name: m.name, artist: m.artist, genre: m.genre, subGenre: '', segment: 'Music',
            date: eventDate.toISOString().split('T')[0],
            time: `${hour}:${i % 2 === 0 ? '00' : '30'}:00`,
            status: 'onsale',
            image: GENRE_IMAGES[m.genre] || GENRE_IMAGES.Rock,
            images: [GENRE_IMAGES[m.genre] || GENRE_IMAGES.Rock],
            venue: {
                id: `v-${i}`,
                name: venueName,
                city: cityName,
                state: '', country: '', address: '', lat: null, lng: null, type: m.venueType
            },
            priceRanges: m.priceMin > 0 ? [{ type: 'standard', currency: 'EUR', min: m.priceMin, max: m.priceMax }] : [],
            ticketUrl: '#', seatmapUrl: null,
            info: `Live at ${venueName}, ${cityName}. ${m.genre} vibes all night.`,
            ageRestrictions: m.venueType === 'club' ? '18+' : null,
            isMock: true, // Flag to show UI indicator
        };
    });
}
