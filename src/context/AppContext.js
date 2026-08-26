import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_ZONES_KEY = 'wc_saved_zones_v1';
const PREMIUM_KEY = 'wc_is_premium_v1';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [savedZones, setSavedZones] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [zonesRaw, premiumRaw] = await Promise.all([
          AsyncStorage.getItem(SAVED_ZONES_KEY),
          AsyncStorage.getItem(PREMIUM_KEY),
        ]);
        if (zonesRaw) setSavedZones(JSON.parse(zonesRaw));
        if (premiumRaw) setIsPremium(premiumRaw === 'true');
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const persistZones = useCallback(async (next) => {
    setSavedZones(next);
    await AsyncStorage.setItem(SAVED_ZONES_KEY, JSON.stringify(next));
  }, []);

  const addSavedZone = useCallback(
    async (zone) => {
      setSavedZones((prev) => {
        if (prev.some((z) => z.id === zone.id)) return prev; // already saved
        const next = [...prev, zone];
        AsyncStorage.setItem(SAVED_ZONES_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const removeSavedZone = useCallback(async (id) => {
    setSavedZones((prev) => {
      const next = prev.filter((z) => z.id !== id);
      AsyncStorage.setItem(SAVED_ZONES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isZoneSaved = useCallback(
    (id) => savedZones.some((z) => z.id === id),
    [savedZones]
  );

  const unlockPremium = useCallback(async () => {
    setIsPremium(true);
    await AsyncStorage.setItem(PREMIUM_KEY, 'true');
  }, []);

  const restorePurchases = useCallback(async () => {
    // Mock restore — in a real app this calls the store's restore API.
    const premiumRaw = await AsyncStorage.getItem(PREMIUM_KEY);
    return premiumRaw === 'true';
  }, []);

  const value = useMemo(
    () => ({
      savedZones,
      addSavedZone,
      removeSavedZone,
      isZoneSaved,
      isReady,
      isPremium,
      adsRemoved: isPremium,
      unlockPremium,
      restorePurchases,
    }),
    [savedZones, addSavedZone, removeSavedZone, isZoneSaved, isReady, isPremium, unlockPremium, restorePurchases]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppData must be used within an AppProvider');
  return ctx;
}

export default AppContext;
