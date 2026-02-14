'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getEventById } from '@/utils/api';
import { formatDate, formatTime, formatPrice, VENUE_TYPES } from '@/utils/constants';
import styles from './page.module.css';

const genreEmojis = {
    'Rock': '🎸', 'Metal': '🤘', 'Pop': '🎤', 'Hip-Hop': '🎧', 'Hip-Hop/Rap': '🎧',
    'Electronic': '🎛️', 'Techno': '💿', 'Indie': '🌙', 'Jazz': '🎷', 'R&B': '💜',
    'Classical': '🎻', 'Folk': '🪕', 'Country': '🤠', 'Latin': '💃', 'Music': '🎵',
};

const venueEmojis = {
    arena: '🏟️', club: '🪩', pub: '🍺', small: '🎪', festival: '🎡', outdoor: '🌳'
};

export default function EventDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { toggleFavourite, isFavourite } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getEventById(params.id);
                setEvent(data);
            } catch (err) {
                console.error('Failed to load event:', err);
            } finally {
                setLoading(false);
            }
        }
        if (params.id) load();
    }, [params.id]);

    if (loading) {
        return <div className={styles.loadingContainer}>🎵</div>;
    }

    if (!event) {
        return (
            <div className="page-content">
                <div className="empty-state">
                    <span className="emoji">😕</span>
                    <h3>Event not found</h3>
                    <p>This event might have been removed or doesn't exist</p>
                    <button className="btn-primary" onClick={() => router.back()}>Go Back</button>
                </div>
            </div>
        );
    }

    const venueType = event.venue?.type || 'small';
    const venueLabel = VENUE_TYPES.find(v => v.id === venueType)?.label || 'Venue';
    const fav = isFavourite(event.id);

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Back button */}
            <button className={styles.backButton} onClick={() => router.back()}>
                ←
            </button>

            {/* Hero image */}
            <div className={styles.heroContainer}>
                {event.image ? (
                    <img src={event.image} alt={event.name} className={styles.heroImg} />
                ) : (
                    <div className={styles.heroPlaceholder}>
                        {genreEmojis[event.genre] || '🎵'}
                    </div>
                )}
                <div className={styles.heroGradient} />
            </div>

            {/* Details */}
            <div className={styles.details}>
                <div className={styles.badges}>
                    <span className={`venue-badge ${venueType}`}>
                        {venueEmojis[venueType]} {venueLabel}
                    </span>
                    <span className="genre-badge">
                        {genreEmojis[event.genre] || '🎵'} {event.genre}
                    </span>
                    {event.status === 'onsale' && (
                        <span className="genre-badge" style={{ color: 'var(--accent-green)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>
                            ✅ On Sale
                        </span>
                    )}
                </div>

                <h1 className={styles.eventName}>{event.name}</h1>

                {/* Info cards */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <span className={styles.infoIcon}>📍</span>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>Venue</div>
                            <div className={styles.infoValue}>{event.venue?.name || 'TBA'}</div>
                            {(event.venue?.city || event.venue?.address) && (
                                <div className={styles.infoSub}>
                                    {event.venue?.address && `${event.venue.address}, `}
                                    {event.venue?.city}
                                    {event.venue?.country && `, ${event.venue.country}`}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <span className={styles.infoIcon}>📅</span>
                        <div className={styles.infoContent}>
                            <div className={styles.infoLabel}>Date & Time</div>
                            <div className={styles.infoValue}>{formatDate(event.date)}</div>
                            {event.time && <div className={styles.infoSub}>Doors at {formatTime(event.time)}</div>}
                        </div>
                    </div>

                    {event.priceRanges?.length > 0 && (
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>💰</span>
                            <div className={styles.infoContent}>
                                <div className={styles.infoLabel}>Price</div>
                                <div className={styles.infoValue}>{formatPrice(event.priceRanges)}</div>
                                {event.priceRanges[0]?.currency && (
                                    <div className={styles.infoSub}>{event.priceRanges[0].currency}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {event.ageRestrictions && (
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>🔞</span>
                            <div className={styles.infoContent}>
                                <div className={styles.infoLabel}>Age Restriction</div>
                                <div className={styles.infoValue}>{event.ageRestrictions}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                {(event.info || event.pleaseNote) && (
                    <div className={styles.description}>
                        <h3 className={styles.descriptionTitle}>About</h3>
                        <p className={styles.descriptionText}>{event.info || event.pleaseNote}</p>
                    </div>
                )}

                {/* Actions */}
                <div className={styles.actions}>
                    <a
                        href={event.ticketUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.ticketButton}
                    >
                        🎫 Get Tickets
                    </a>
                    <motion.button
                        className={`${styles.actionButton} ${fav ? styles.active : ''}`}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggleFavourite(event)}
                    >
                        {fav ? '❤️' : '🤍'}
                    </motion.button>
                    <motion.button
                        className={styles.actionButton}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: event.name, url: window.location.href });
                            }
                        }}
                    >
                        📤
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
