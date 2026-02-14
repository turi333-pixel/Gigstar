'use client';

import EventCard from '@/components/EventCard/EventCard';
import styles from './EventCarousel.module.css';

export default function EventCarousel({ title, emoji, events, onSeeAll }) {
    if (!events || events.length === 0) return null;

    return (
        <div>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    {emoji && <span>{emoji}</span>}
                    {title}
                </h2>
                {onSeeAll && (
                    <button className={styles.seeAll} onClick={onSeeAll}>
                        See all →
                    </button>
                )}
            </div>
            <div className={styles.carousel}>
                {events.map((event, i) => (
                    <div key={event.id} className={styles.carouselItem}>
                        <EventCard event={event} size="small" index={i} />
                    </div>
                ))}
            </div>
        </div>
    );
}
