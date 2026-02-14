'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/constants';
import AuthModal from '@/components/AuthModal/AuthModal';
import styles from './page.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading, favourites, searchHistory, logout, toggleFavourite } = useAuth();
    const [showAuth, setShowAuth] = useState(false);

    const uniqueVenues = useMemo(() => {
        const venues = new Set(favourites.map(f => f.venue?.name).filter(Boolean));
        return venues.size;
    }, [favourites]);

    if (isLoading) {
        return (
            <div className="page-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontSize: '2rem' }}>
                    🎵
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="page-content">
                <div className={styles.header}>
                    <h1 className={styles.title}>👤 Profile</h1>
                    <p className={styles.subtitle}>Save your favourite gigs and more</p>
                </div>

                <div className={styles.guestContainer}>
                    <motion.span
                        className={styles.guestEmoji}
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                        🎸
                    </motion.span>
                    <h2 className={styles.guestTitle}>Join the party!</h2>
                    <p className={styles.guestText}>
                        Create your free account to save concerts, track your favourite venues, and get personalised picks
                    </p>
                    <button className="btn-primary" onClick={() => setShowAuth(true)}>
                        🚀 Get Started
                    </button>
                    <button className="btn-secondary" onClick={() => setShowAuth(true)}>
                        Already have an account? Log in
                    </button>
                </div>

                <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className={styles.header}>
                <h1 className={styles.title}>👤 Profile</h1>
            </div>

            {/* Profile card */}
            <div className={styles.profileCard}>
                <img
                    src={user.avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${user.username}`}
                    alt={user.username}
                    className={styles.avatar}
                />
                <div className={styles.profileInfo}>
                    <div className={styles.username}>{user.username}</div>
                    <div className={styles.email}>{user.email}</div>
                    <div className={styles.memberSince}>
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <button className={styles.logoutButton} onClick={logout}>
                    Logout
                </button>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>{favourites.length}</div>
                    <div className={styles.statLabel}>Saved</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>{uniqueVenues}</div>
                    <div className={styles.statLabel}>Venues</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>{searchHistory.length}</div>
                    <div className={styles.statLabel}>Searches</div>
                </div>
            </div>

            {/* Saved concerts */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>❤️ Saved Concerts</h2>
                    <span className={styles.sectionCount}>{favourites.length}</span>
                </div>

                {favourites.length === 0 ? (
                    <div className="empty-state" style={{ padding: '32px 0' }}>
                        <span className="emoji">🎵</span>
                        <h3>No saved concerts yet</h3>
                        <p>Tap the heart on events you love to save them here</p>
                    </div>
                ) : (
                    <div className={styles.favList}>
                        {favourites.map((event, i) => (
                            <motion.div
                                key={event.id}
                                className={styles.favItem}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => router.push(`/event/${event.id}`)}
                            >
                                {event.image ? (
                                    <img src={event.image} alt={event.name} className={styles.favImage} />
                                ) : (
                                    <div className={styles.favImagePlaceholder}>🎵</div>
                                )}
                                <div className={styles.favInfo}>
                                    <div className={styles.favName}>{event.name}</div>
                                    <div className={styles.favVenue}>📍 {event.venue?.name}</div>
                                    <div className={styles.favDate}>📅 {formatDate(event.date)}</div>
                                </div>
                                <button
                                    className={styles.removeButton}
                                    onClick={(e) => { e.stopPropagation(); toggleFavourite(event); }}
                                >
                                    ❌
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent searches */}
            {searchHistory.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>🕐 Recent Searches</h2>
                    </div>
                    <div className={styles.favList}>
                        {searchHistory.slice(0, 10).map((h, i) => (
                            <div
                                key={i}
                                className={styles.favItem}
                                onClick={() => router.push(`/search?q=${encodeURIComponent(h.term)}`)}
                            >
                                <div className={styles.favImagePlaceholder}>🔍</div>
                                <div className={styles.favInfo}>
                                    <div className={styles.favName}>{h.term}</div>
                                    <div className={styles.favVenue}>
                                        {new Date(h.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
}
