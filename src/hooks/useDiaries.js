import { useState, useCallback } from 'react';

const STORAGE_KEY = 'todorok-entries';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useDiaries() {
  const [diaries, setDiaries] = useState(load);

  const create = useCallback((date, title, content, emoji) => {
    setDiaries(prev => {
      const next = { ...prev, [date]: { date, title, content, emoji: emoji || '' } };
      save(next);
      return next;
    });
  }, []);

  const update = useCallback((date, title, content, emoji) => {
    setDiaries(prev => {
      const next = { ...prev, [date]: { ...prev[date], title, content, emoji: emoji || '' } };
      save(next);
      return next;
    });
  }, []);

  const remove = useCallback((date) => {
    setDiaries(prev => {
      const next = { ...prev };
      delete next[date];
      save(next);
      return next;
    });
  }, []);

  return { diaries, create, update, remove };
}
