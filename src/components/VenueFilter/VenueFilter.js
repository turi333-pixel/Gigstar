'use client';

import { motion } from 'framer-motion';
import { VENUE_TYPES } from '@/utils/constants';
import styles from '../GenreChips/GenreChips.module.css';

export default function VenueFilter({ selected, onSelect }) {
    return (
        <div className={styles.container}>
            {VENUE_TYPES.map((venue) => (
                <motion.button
                    key={venue.id}
                    className={`${styles.chip} ${selected === venue.id ? styles.active : ''}`}
                    onClick={() => onSelect(venue.id)}
                    whileTap={{ scale: 0.93 }}
                >
                    <span className={styles.emoji}>{venue.emoji}</span>
                    {venue.label}
                </motion.button>
            ))}
        </div>
    );
}
