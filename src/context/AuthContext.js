'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [favourites, setFavourites] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('gigster_user');
        const storedFavs = localStorage.getItem('gigster_favourites');
        const storedHistory = localStorage.getItem('gigster_history');

        if (stored) setUser(JSON.parse(stored));
        if (storedFavs) setFavourites(JSON.parse(storedFavs));
        if (storedHistory) setSearchHistory(JSON.parse(storedHistory));
        setIsLoading(false);
    }, []);

    const signup = useCallback((username, email, password) => {
        const users = JSON.parse(localStorage.getItem('gigster_users') || '[]');
        if (users.find(u => u.email === email)) {
            throw new Error('Email already registered');
        }
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${username}`,
            createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        localStorage.setItem('gigster_users', JSON.stringify(users));

        const { password: _, ...safeUser } = newUser;
        setUser(safeUser);
        localStorage.setItem('gigster_user', JSON.stringify(safeUser));
        return safeUser;
    }, []);

    const login = useCallback((email, password) => {
        const users = JSON.parse(localStorage.getItem('gigster_users') || '[]');
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) throw new Error('Invalid email or password');

        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        localStorage.setItem('gigster_user', JSON.stringify(safeUser));
        return safeUser;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('gigster_user');
    }, []);

    const toggleFavourite = useCallback((event) => {
        setFavourites(prev => {
            const exists = prev.find(f => f.id === event.id);
            let next;
            if (exists) {
                next = prev.filter(f => f.id !== event.id);
            } else {
                next = [{ ...event, savedAt: new Date().toISOString() }, ...prev];
            }
            localStorage.setItem('gigster_favourites', JSON.stringify(next));
            return next;
        });
    }, []);

    const isFavourite = useCallback((eventId) => {
        return favourites.some(f => f.id === eventId);
    }, [favourites]);

    const addSearchHistory = useCallback((term) => {
        if (!term || term.trim() === '') return;
        setSearchHistory(prev => {
            const filtered = prev.filter(h => h.term !== term);
            const next = [{ term, timestamp: new Date().toISOString() }, ...filtered].slice(0, 20);
            localStorage.setItem('gigster_history', JSON.stringify(next));
            return next;
        });
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            favourites,
            searchHistory,
            signup,
            login,
            logout,
            toggleFavourite,
            isFavourite,
            addSearchHistory,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
