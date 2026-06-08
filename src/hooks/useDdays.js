import { useState, useEffect, useCallback } from 'react';
import { storageGet, storageSet } from '../utils/storage';

const STORAGE_KEY = 'todorok-ddays';

export function useDdays() {
  const [ddays, setDdays] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storageGet(STORAGE_KEY)
      .then(raw => {
        try { setDdays(raw ? JSON.parse(raw) : []); } catch { setDdays([]); }
      })
      .catch(() => { setDdays([]); })
      .finally(() => { setLoaded(true); });
  }, []);

  const addDday = useCallback((title, date) => {
    setDdays(prev => {
      const next = [...prev, { id: Date.now().toString(), title, date }];
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeDday = useCallback((id) => {
    setDdays(prev => {
      const next = prev.filter(d => d.id !== id);
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateDday = useCallback((id, title, date) => {
    setDdays(prev => {
      const next = prev.map(d => d.id === id ? { ...d, title, date } : d);
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { ddays, loaded, addDday, removeDday, updateDday };
}
