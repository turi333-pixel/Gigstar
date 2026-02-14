'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatTime, formatPrice, VENUE_TYPES } from '@/utils/constants';
import styles from './EventCard.module.css';

const genreEmojis = {
    'Rock': '🎸', 'Metal': '🤘', 'Pop': '🎤', 'Hip-Hop': '🎧', 'Hip-Hop/Rap': '🎧',
    'Electronic': '🎛️', 'Techno': '💿', 'Indie': '🌙', 'Jazz': '🎷', 'R&B': '💜',
    'Classical': '🎻', 'Folk': '🪕', 'Country': '🤠', 'Latin': '💃', 'Music': '🎵',
    'Dance/Electronic': '🎛️', 'Alternative': '🌙',
};

const venueEmojis = {
    arena: '🏟️', club: '🪩', pub: '🍺', small: '🎪', festival: '🎡', outdoor: '🌳'
};

export default function EventCard({ event, size = 'medium', index = 0 }) {
    const router = useRouter();
    const { toggleFavourite, isFavourite, user } = useAuth();

    const genreKey = (event.genre || '').toLowerCase().replace(/[^a-z]/g, '');
    const venueType = event.venue?.type || 'small';
    const venueLabel = VENUE_TYPES.find(v => v.id === venueType)?.label || 'Venue';
    const fav = isFavourite(event.id);

    const handleFav = (e) => {
        e.stopPropagation();
        toggleFavourite(event);
    };

    return (
        <motion.div
            className={`${styles.card} ${styles[`card${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/event/${event.id}`)}
            layout
        >
            <div className={styles.imageContainer}>
                {event.image ? (
                    <img src={event.image} alt={event.name} className={styles.image} loading="lazy" />
                ) : (
                    <div className={styles.placeholder}>
                        {genreEmojis[event.genre] || '🎵'}
                    </div>
                )}
            </div>

            <div className={styles.overlay} />

            <div className={styles.topBadges}>
                <span className={`venue-badge ${venueType}`}>
                    {venueEmojis[venueType]} {venueLabel}
                </span>
                <button
                    className={`${styles.favButton} ${fav ? styles.active : ''}`}
                    onClick={handleFav}
                    aria-label={fav ? 'Remove from favourites' : 'Add to favourites'}
                >
                    {fav ? '❤️' : '🤍'}
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.badges}>
                    <span className="genre-badge">
                        {genreEmojis[event.genre] || '🎵'} {event.genre}
                    </span>
                </div>
                <h3 className={styles.name}>{event.name}</h3>
                <div className={styles.meta}>
                    <span className={styles.venue}>📍 {event.venue?.name}{event.venue?.city ? `, ${event.venue.city}` : ''}</span>
                    <div className={styles.dateTime}>
                        <span>📅 {formatDate(event.date)}</span>
                        {event.time && <span>🕐 {formatTime(event.time)}</span>}
                        {event.priceRanges?.length > 0 && (
                            <span className={styles.price}>💰 {formatPrice(event.priceRanges)}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className={`${styles.accentStrip} ${styles[genreKey]}`} />
        </motion.div>
    );
}
