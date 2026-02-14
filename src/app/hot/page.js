'use client';

import { useState, useEffect, useMemo } from 'react';
import { searchEvents } from '@/utils/api';
import { DEFAULT_LOCATION } from '@/utils/constants';
import EventCard from '@/components/EventCard/EventCard';
import { SkeletonGrid } from '@/components/LoadingSkeleton/LoadingSkeleton';
import styles from './page.module.css';

export default function HotPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await searchEvents({
                    city: DEFAULT_LOCATION.city,
                    dateRange: 'today',
                    size: 20,
                    sort: 'relevance,desc',
                });
                setEvents(data.events || []);
            } catch (err) {
                console.error('Failed to load hot events:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const categorized = useMemo(() => {
        const cats = {
            concerts: { label: 'Concerts & Live Shows', emoji: '🎸', events: [] },
            clubs: { label: 'Club Nights & DJ Sets', emoji: '🪩', events: [] },
            pubs: { label: 'Pub Gigs & Open Mics', emoji: '🍺', events: [] },
            festivals: { label: 'Festivals & Outdoor', emoji: '🎡', events: [] },
        };

        events.forEach(e => {
            const type = e.venue?.type || 'small';
            if (type === 'festival' || type === 'outdoor') cats.festivals.events.push(e);
            else if (type === 'club') cats.clubs.events.push(e);
            else if (type === 'pub') cats.pubs.events.push(e);
            else cats.concerts.events.push(e);
        });

        return Object.values(cats).filter(c => c.events.length > 0);
    }, [events]);

    return (
        <div className="page-content">
            <div className={styles.header}>
                <h1 className={styles.title}>🔥 Hot Tonight</h1>
                <p className={styles.subtitle}>Don't miss out — happening right now</p>
            </div>

            {loading && <SkeletonGrid count={4} />}

            {!loading && events.length === 0 && (
                <div className="empty-state">
                    <span className="emoji">🌙</span>
                    <h3>Nothing tonight... yet</h3>
                    <p>Check back later or search for upcoming events</p>
                </div>
            )}

            {!loading && categorized.map((cat) => (
                <div key={cat.label} className={styles.category}>
                    <div className={styles.categoryHeader}>
                        <span className={styles.categoryEmoji}>{cat.emoji}</span>
                        <h2 className={styles.categoryTitle}>{cat.label}</h2>
                        <span className={styles.countdown}>⚡ TONIGHT</span>
                    </div>
                    <div className={styles.eventsGrid}>
                        {cat.events.map((event, i) => (
                            <EventCard key={event.id} event={event} size="medium" index={i} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
