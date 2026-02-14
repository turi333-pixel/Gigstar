'use client';

import { useState, useCallback, useEffect } from 'react';
import { getCurrentPosition, reverseGeocode } from '@/utils/api';
import styles from './LocationBar.module.css';

export default function LocationBar({ city, onCityChange, onLocationDetected }) {
    const [detecting, setDetecting] = useState(false);
    const [inputValue, setInputValue] = useState(city || '');
    const [error, setError] = useState('');

    // Sync input when parent city changes
    useEffect(() => {
        setInputValue(city || '');
    }, [city]);

    const handleDetect = useCallback(async () => {
        setDetecting(true);
        setError('');
        try {
            const pos = await getCurrentPosition();
            // Reverse geocode to get actual city name
            const cityName = await reverseGeocode(pos.lat, pos.lng);
            if (cityName) {
                setInputValue(cityName);
                onCityChange(cityName);
            }
            onLocationDetected({ ...pos, city: cityName });
        } catch (err) {
            console.error('Location error:', err);
            if (err.code === 1) {
                setError('Location access denied. Please enable in browser settings.');
            } else if (err.code === 2) {
                setError('Position unavailable. Try again.');
            } else if (err.code === 3) {
                setError('Location timed out. Try again.');
            } else {
                setError('Could not detect location.');
            }
        } finally {
            setDetecting(false);
        }
    }, [onLocationDetected, onCityChange]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            setError('');
            onCityChange(inputValue.trim());
        }
    };

    const handleBlur = () => {
        if (inputValue.trim() && inputValue.trim() !== city) {
            onCityChange(inputValue.trim());
        }
    };

    return (
        <div className={styles.container}>
            <span className={styles.locationIcon}>📍</span>
            <input
                type="text"
                className={styles.input}
                placeholder="Enter city or venue..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
            <button
                className={styles.detectButton}
                onClick={handleDetect}
                disabled={detecting}
            >
                <span className={detecting ? styles.detecting : ''}>📡</span>
                {detecting ? 'Locating...' : 'Near me'}
            </button>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
}
