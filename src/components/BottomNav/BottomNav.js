'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BottomNav.module.css';

const tabs = [
    { href: '/', label: 'Discover', icon: '🧭', id: 'discover' },
    { href: '/search', label: 'Search', icon: '🔍', id: 'search' },
    { href: '/hot', label: 'Hot', icon: '🔥', id: 'hot' },
    { href: '/profile', label: 'Profile', icon: '👤', id: 'profile' },
];

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (href) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <nav className={styles.nav}>
            {tabs.map((tab) => (
                <Link
                    key={tab.id}
                    href={tab.href}
                    className={`${styles.navItem} ${isActive(tab.href) ? styles.active : ''}`}
                >
                    <AnimatePresence>
                        {isActive(tab.href) && (
                            <motion.div
                                className={styles.activeIndicator}
                                layoutId="activeTab"
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                exit={{ opacity: 0, scaleX: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                    </AnimatePresence>
                    <span className={styles.navIcon}>{tab.icon}</span>
                    <span className={styles.navLabel}>{tab.label}</span>
                </Link>
            ))}
        </nav>
    );
}
