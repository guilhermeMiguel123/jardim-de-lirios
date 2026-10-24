import { useState, useEffect, useCallback } from 'react';
import { QUOTES } from '../data/quotes';

const STORAGE_KEY = 'jardim_lirios_state_v1';

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function useDailyQuote() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.seenIds)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler localStorage:', e);
    }
    return {
      seenIds: [],
      favorites: [],
      lastDate: null,
      currentQuoteId: null,
      history: [],
    };
  });

  const pickNewUnseenQuote = useCallback((currentState, dateTag) => {
    let currentSeen = [...currentState.seenIds];
    if (currentSeen.length >= QUOTES.length) {
      currentSeen = [];
    }
    const available = QUOTES.filter((q) => !currentSeen.includes(q.id));
    const randomQuote = available[Math.floor(Math.random() * available.length)] || QUOTES[0];
    const updatedSeen = [...currentSeen, randomQuote.id];
    const updatedHistory = [
      { id: randomQuote.id, date: dateTag, dayNumber: updatedSeen.length },
      ...currentState.history.filter((h) => h.id !== randomQuote.id),
    ];

    return {
      ...currentState,
      seenIds: updatedSeen,
      lastDate: dateTag,
      currentQuoteId: randomQuote.id,
      history: updatedHistory,
    };
  }, []);

  useEffect(() => {
    const today = getTodayKey();
    if (state.lastDate !== today || !state.currentQuoteId) {
      const nextState = pickNewUnseenQuote(state, today);
      setState(nextState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
  }, [state, pickNewUnseenQuote]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Erro ao salvar localStorage:', e);
    }
  }, [state]);

  const bloomAnotherLily = () => {
    const today = getTodayKey();
    const nextState = pickNewUnseenQuote(state, today);
    setState(nextState);
  };

  const toggleFavorite = (quoteId) => {
    setState((prev) => {
      const exists = prev.favorites.includes(quoteId);
      const updatedFavs = exists
        ? prev.favorites.filter((id) => id !== quoteId)
        : [...prev.favorites, quoteId];
      return { ...prev, favorites: updatedFavs };
    });
  };

  const selectQuoteFromGarden = (quoteId) => {
    setState((prev) => ({
      ...prev,
      currentQuoteId: quoteId,
    }));
  };

  const resetCycle = () => {
    const today = getTodayKey();
    const fresh = pickNewUnseenQuote(
      { seenIds: [], favorites: state.favorites, lastDate: null, currentQuoteId: null, history: [] },
      today
    );
    setState(fresh);
  };

  const currentQuote = QUOTES.find((q) => q.id === state.currentQuoteId) || QUOTES[0];

  return {
    state,
    currentQuote,
    bloomAnotherLily,
    toggleFavorite,
    selectQuoteFromGarden,
    resetCycle,
  };
}
