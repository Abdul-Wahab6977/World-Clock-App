import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/**
 * A fully working, self-contained auth flow (sign up, sign in, sign out,
 * persisted session) with no backend required — accounts and sessions live
 * in on-device AsyncStorage. Passwords are SHA-256 hashed before storage.
 *
 * This is the right shape to swap for a real backend later: replace the
 * body of signUp/signIn with calls to your API and keep the same contract
 * (resolve with a user object, or throw an Error with a friendly message).
 */

const USERS_KEY = 'wc_users_v1';
const SESSION_KEY = 'wc_session_v1';

const AuthContext = createContext(null);

async function hashPassword(password) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

async function loadUsers() {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveUsers(users) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const email = await AsyncStorage.getItem(SESSION_KEY);
        if (email) {
          const users = await loadUsers();
          const found = users.find((u) => u.email === email);
          if (found) setUser({ name: found.name, email: found.email });
        }
      } finally {
        setIsBooting(false);
      }
    })();
  }, []);

  const signUp = async ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!name.trim()) throw new Error('Please enter your name.');
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) throw new Error('Please enter a valid email address.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    const users = await loadUsers();
    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await hashPassword(password);
    const newUser = { name: name.trim(), email: cleanEmail, passwordHash };
    await saveUsers([...users, newUser]);
    await AsyncStorage.setItem(SESSION_KEY, cleanEmail);
    setUser({ name: newUser.name, email: newUser.email });
  };

  const signIn = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = await loadUsers();
    const found = users.find((u) => u.email === cleanEmail);
    if (!found) throw new Error('No account found for this email.');

    const passwordHash = await hashPassword(password);
    if (passwordHash !== found.passwordHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    await AsyncStorage.setItem(SESSION_KEY, cleanEmail);
    setUser({ name: found.name, email: found.email });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isBooting, isSignedIn: !!user, signUp, signIn, signOut }),
    [user, isBooting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
