import { useState, useCallback } from 'react';

const STORAGE_KEY = 'todorok-ddays';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useDdays() {
  const [ddays, setDdays] = useState(load);

  const addDday = useCallback((title, date) => {
    setDdays(prev => {
      const next = [...prev, { id: Date.now().toString(), title, date }];
      save(next);
      return next;
    });
  }, []);

  const removeDday = useCallback((id) => {
    setDdays(prev => {
      const next = prev.filter(d => d.id !== id);
      save(next);
      return next;
    });
  }, []);

  const updateDday = useCallback((id, title, date) => {
    setDdays(prev => {
      const next = prev.map(d => d.id === id ? { ...d, title, date } : d);
      save(next);
      return next;
    });
  }, []);

  return { ddays, addDday, removeDday, updateDday };
}
