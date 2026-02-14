'use client';

import styles from './LoadingSkeleton.module.css';

export function SkeletonCard() {
    return <div className={styles.skeletonCard} />;
}

export function SkeletonSmallCard() {
    return <div className={styles.skeletonSmall} />;
}

export function SkeletonChip() {
    return <div className={styles.skeletonChip} />;
}

export function SkeletonGrid({ count = 3 }) {
    return (
        <div className={styles.skeletonGrid}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonRow({ count = 4 }) {
    return (
        <div className={styles.skeletonRow}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonSmallCard key={i} />
            ))}
        </div>
    );
}
