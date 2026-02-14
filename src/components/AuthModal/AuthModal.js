'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (!username.trim()) throw new Error('Username is required');
                if (!email.trim()) throw new Error('Email is required');
                if (password.length < 4) throw new Error('Password must be at least 4 characters');
                signup(username.trim(), email.trim(), password);
            } else {
                if (!email.trim()) throw new Error('Email is required');
                if (!password) throw new Error('Password is required');
                login(email.trim(), password);
            }
            resetForm();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setError('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={styles.modal}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.header}>
                            <h2 className={styles.title}>
                                {mode === 'login' ? '👋 Welcome back!' : '🎸 Join Gigster'}
                            </h2>
                            <button className={styles.closeButton} onClick={onClose}>✕</button>
                        </div>

                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`}
                                onClick={() => switchMode('login')}
                            >
                                Log In
                            </button>
                            <button
                                className={`${styles.tab} ${mode === 'signup' ? styles.active : ''}`}
                                onClick={() => switchMode('signup')}
                            >
                                Sign Up
                            </button>
                        </div>

                        {error && <div className={styles.error}>⚠️ {error}</div>}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {mode === 'signup' && (
                                    <motion.div
                                        key="username"
                                        className={styles.inputGroup}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <label className={styles.label}>Username</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="your_cool_name"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Password</label>
                                <input
                                    type="password"
                                    className={styles.input}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading
                                    ? '⏳ Loading...'
                                    : mode === 'login'
                                        ? '🚀 Log In'
                                        : '🎉 Create Account'
                                }
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
