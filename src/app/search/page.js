'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { searchEvents } from '@/utils/api';
import { DATE_RANGES, DEFAULT_LOCATION } from '@/utils/constants';
import GenreChips from '@/components/GenreChips/GenreChips';
import VenueFilter from '@/components/VenueFilter/VenueFilter';
import EventCard from '@/components/EventCard/EventCard';
import { SkeletonGrid } from '@/components/LoadingSkeleton/LoadingSkeleton';
import styles from './page.module.css';

export default function SearchPage() {
    const { searchHistory, addSearchHistory } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [genre, setGenre] = useState('all');
    const [venueType, setVenueType] = useState('all');
    const [dateRange, setDateRange] = useState('');

    const doSearch = useCallback(async (searchQuery) => {
        const q = searchQuery || query;
        if (!q.trim() && genre === 'all' && !dateRange) return;

        setLoading(true);
        setHasSearched(true);
        if (q.trim()) addSearchHistory(q.trim());

        try {
            const data = await searchEvents({
                keyword: q.trim() || undefined,
                city: DEFAULT_LOCATION.city,
                genre: genre !== 'all' ? genre : undefined,
                dateRange: dateRange || undefined,
                size: 20,
            });
            setResults(data.events || []);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    }, [query, genre, dateRange, addSearchHistory]);

    useEffect(() => {
        if (genre !== 'all' || dateRange) {
            doSearch();
        }
    }, [genre, dateRange]);

    const filteredResults = useMemo(() => {
        if (venueType === 'all') return results;
        return results.filter(e => e.venue?.type === venueType);
    }, [results, venueType]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') doSearch();
    };

    return (
        <div className="page-content">
            <div className={styles.header}>
                <h1 className={styles.title}>🔍 Search</h1>
                <p className={styles.subtitle}>Find your next unforgettable night</p>
            </div>

            {/* Search box */}
            <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Artist, venue, event..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Filters */}
            <div className={styles.filtersSection}>
                <div className={styles.filterGroup}>
                    <div className={styles.filterLabel}>Genre</div>
                    <GenreChips selected={genre} onSelect={setGenre} />
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterLabel}>Venue Type</div>
                    <VenueFilter selected={venueType} onSelect={setVenueType} />
                </div>

                <div className={styles.filterGroup}>
                    <div className={styles.filterLabel}>When</div>
                    <div className={styles.dateChips}>
                        {DATE_RANGES.map(dr => (
                            <motion.button
                                key={dr.id}
                                className={`${styles.dateChip} ${dateRange === dr.id ? styles.active : ''}`}
                                onClick={() => setDateRange(dateRange === dr.id ? '' : dr.id)}
                                whileTap={{ scale: 0.93 }}
                            >
                                {dr.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent searches */}
            {!hasSearched && searchHistory.length > 0 && (
                <div className={styles.recentSearches}>
                    <div className={styles.filterLabel}>Recent Searches</div>
                    <div className={styles.recentList}>
                        {searchHistory.slice(0, 5).map((h, i) => (
                            <div
                                key={i}
                                className={styles.recentItem}
                                onClick={() => { setQuery(h.term); doSearch(h.term); }}
                            >
                                🕐 {h.term}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            {loading && <SkeletonGrid count={3} />}

            {!loading && hasSearched && (
                <>
                    <div className={styles.resultsHeader}>
                        <span className={styles.resultsCount}>
                            {filteredResults.length} event{filteredResults.length !== 1 ? 's' : ''} found
                        </span>
                    </div>
                    <div className={styles.resultsGrid}>
                        {filteredResults.map((event, i) => (
                            <EventCard key={event.id} event={event} size="medium" index={i} />
                        ))}
                    </div>
                    {filteredResults.length === 0 && (
                        <div className="empty-state">
                            <span className="emoji">🔍</span>
                            <h3>No matches</h3>
                            <p>Try different keywords or loosen your filters</p>
                        </div>
                    )}
                </>
            )}

            {!hasSearched && !loading && (
                <div className="empty-state">
                    <span className="emoji">🎵</span>
                    <h3>What are you in the mood for?</h3>
                    <p>Search for artists, venues, or genres to find your vibe</p>
                </div>
            )}
        </div>
    );
}
