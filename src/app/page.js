'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { searchEvents, getCurrentPosition, reverseGeocode } from '@/utils/api';
import { formatDate, formatTime, formatPrice, DEFAULT_LOCATION } from '@/utils/constants';
import LocationBar from '@/components/LocationBar/LocationBar';
import GenreChips from '@/components/GenreChips/GenreChips';
import VenueFilter from '@/components/VenueFilter/VenueFilter';
import EventCard from '@/components/EventCard/EventCard';
import EventCarousel from '@/components/EventCarousel/EventCarousel';
import { SkeletonGrid, SkeletonRow } from '@/components/LoadingSkeleton/LoadingSkeleton';
import styles from './page.module.css';

export default function DiscoverPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [apiError, setApiError] = useState('');
  const [city, setCity] = useState('');
  const [latLong, setLatLong] = useState('');
  const [genre, setGenre] = useState('all');
  const [venueType, setVenueType] = useState('all');
  const autoDetected = useRef(false);

  const fetchEvents = useCallback(async (searchCity, searchLatLong) => {
    setLoading(true);
    try {
      const data = await searchEvents({
        city: searchLatLong ? undefined : (searchCity || DEFAULT_LOCATION.city),
        latLong: searchLatLong || undefined,
        genre: genre !== 'all' ? genre : undefined,
        size: 20,
      });
      setEvents(data.events || []);
      setIsMock(data.isMock || false);
      setApiError(data.error || '');
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setApiError('Could not reach the server');
    } finally {
      setLoading(false);
    }
  }, [genre]);

  // Auto-detect location on first load
  useEffect(() => {
    if (autoDetected.current) return;
    autoDetected.current = true;

    (async () => {
      try {
        const pos = await getCurrentPosition();
        const cityName = await reverseGeocode(pos.lat, pos.lng);
        if (cityName) {
          setCity(cityName);
          setLatLong(pos.latLong);
          fetchEvents(cityName, pos.latLong);
        } else {
          setCity(DEFAULT_LOCATION.city);
          fetchEvents(DEFAULT_LOCATION.city, '');
        }
      } catch {
        // Geolocation denied or unavailable — fall back to default
        setCity(DEFAULT_LOCATION.city);
        fetchEvents(DEFAULT_LOCATION.city, '');
      }
    })();
  }, [fetchEvents]);

  // Re-fetch when genre changes
  useEffect(() => {
    if (!autoDetected.current) return; // Don't double-fetch on mount
    fetchEvents(city, latLong);
  }, [genre]);

  const handleLocationDetected = useCallback((pos) => {
    setLatLong(pos.latLong);
    if (pos.city) {
      setCity(pos.city);
    }
    // Immediately refresh events with new location
    fetchEvents(pos.city, pos.latLong);
  }, [fetchEvents]);

  const handleCityChange = useCallback((newCity) => {
    setCity(newCity);
    setLatLong('');
    // Immediately refresh events with new city
    fetchEvents(newCity, '');
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    if (venueType === 'all') return events;
    return events.filter(e => e.venue?.type === venueType);
  }, [events, venueType]);

  const heroEvent = filteredEvents[0];
  const todayEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return filteredEvents.filter(e => e.date === today);
  }, [filteredEvents]);

  const trendingEvents = useMemo(() => filteredEvents.slice(0, 8), [filteredEvents]);

  const festivalEvents = useMemo(() =>
    filteredEvents.filter(e => e.venue?.type === 'festival' || e.venue?.type === 'outdoor'),
    [filteredEvents]
  );

  const pubEvents = useMemo(() =>
    filteredEvents.filter(e => e.venue?.type === 'pub' || e.venue?.type === 'club'),
    [filteredEvents]
  );

  const remainingEvents = useMemo(() => filteredEvents.slice(1), [filteredEvents]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-content">
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.logo}>
            🎸 <span className={styles.logoAccent}>Gigster</span>
          </h1>
          <p className={styles.greeting}>
            {getGreeting()}{user ? `, ${user.username}` : ''} 🤘
          </p>
        </div>
      </div>

      {/* API error / setup banner */}
      {apiError && (
        <div className="mock-banner">
          ⚡ {apiError}
        </div>
      )}

      {/* Location Bar */}
      <LocationBar
        city={city}
        onCityChange={handleCityChange}
        onLocationDetected={handleLocationDetected}
      />

      {/* Filters */}
      <div className={styles.filterBar}>
        <GenreChips selected={genre} onSelect={setGenre} />
        <VenueFilter selected={venueType} onSelect={setVenueType} />
      </div>

      {loading ? (
        <>
          <SkeletonGrid count={1} />
          <div style={{ marginTop: 24 }}><SkeletonRow /></div>
        </>
      ) : (
        <>
          {/* Hero — Hot Tonight */}
          {heroEvent && (
            <div className={styles.heroSection}>
              <div className={styles.sectionLabel}>🔥 Hot Tonight</div>
              <motion.div
                className={styles.heroCard}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/event/${heroEvent.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {heroEvent.image ? (
                  <img src={heroEvent.image} alt={heroEvent.name} className={styles.heroImage} />
                ) : (
                  <div className={styles.heroPlaceholder}>🎶</div>
                )}
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                  <div className={styles.heroLabel}>🔥 Featured</div>
                  <h2 className={styles.heroTitle}>{heroEvent.name}</h2>
                  <div className={styles.heroMeta}>
                    <span className={styles.heroMetaItem}>📍 {heroEvent.venue?.name}</span>
                    <span className={styles.heroMetaItem}>📅 {formatDate(heroEvent.date)}</span>
                    {heroEvent.time && <span className={styles.heroMetaItem}>🕐 {formatTime(heroEvent.time)}</span>}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Trending This Week */}
          <div className={styles.section}>
            <EventCarousel
              title="Trending This Week"
              emoji="📈"
              events={trendingEvents}
              onSeeAll={() => router.push('/search')}
            />
          </div>

          {/* Festivals & Outdoor */}
          {festivalEvents.length > 0 && (
            <div className={styles.section}>
              <EventCarousel
                title="Festivals & Outdoor"
                emoji="🎡"
                events={festivalEvents}
              />
            </div>
          )}

          {/* Pub Gigs & Club Nights */}
          {pubEvents.length > 0 && (
            <div className={styles.section}>
              <EventCarousel
                title="Pub Gigs & Club Nights"
                emoji="🪩"
                events={pubEvents}
              />
            </div>
          )}

          {/* All Events */}
          {remainingEvents.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>🎵 More near you</div>
              <div className={styles.eventsGrid}>
                {remainingEvents.map((event, i) => (
                  <EventCard key={event.id} event={event} size="medium" index={i} />
                ))}
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <span className="emoji">🎵</span>
              <h3>No events found</h3>
              <p>Try changing your filters or searching a different city</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
