'use client';

import { motion } from 'framer-motion';
import { GENRES } from '@/utils/constants';
import styles from './GenreChips.module.css';

export default function GenreChips({ selected, onSelect }) {
    return (
        <div className={styles.container}>
            {GENRES.map((genre) => (
                <motion.button
                    key={genre.id}
                    className={`${styles.chip} ${selected === genre.id ? styles.active : ''}`}
                    onClick={() => onSelect(genre.id)}
                    whileTap={{ scale: 0.93 }}
                >
                    <span className={styles.emoji}>{genre.emoji}</span>
                    {genre.label}
                </motion.button>
            ))}
        </div>
    );
}
