import { useState, useEffect, useCallback } from 'react';
import { storageGet, storageSet } from '../utils/storage';

const STORAGE_KEY = 'todorok-entries';

export function useDiaries() {
  const [diaries, setDiaries] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storageGet(STORAGE_KEY).then(raw => {
      try { setDiaries(raw ? JSON.parse(raw) : {}); } catch { setDiaries({}); }
      setLoaded(true);
    });
  }, []);

  const create = useCallback((date, title, content, emoji) => {
    setDiaries(prev => {
      const next = { ...prev, [date]: { date, title, content, emoji: emoji || '' } };
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const update = useCallback((date, title, content, emoji) => {
    setDiaries(prev => {
      const next = { ...prev, [date]: { ...prev[date], title, content, emoji: emoji || '' } };
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((date) => {
    setDiaries(prev => {
      const next = { ...prev };
      delete next[date];
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { diaries, loaded, create, update, remove };
}
