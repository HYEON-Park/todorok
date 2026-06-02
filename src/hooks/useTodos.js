import { useState, useEffect, useCallback } from 'react';
import { storageGet, storageSet } from '../utils/storage';

const STORAGE_KEY = 'todorok-todos';

export function useTodos() {
  const [todos, setTodos] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storageGet(STORAGE_KEY).then(raw => {
      try { setTodos(raw ? JSON.parse(raw) : {}); } catch { setTodos({}); }
      setLoaded(true);
    });
  }, []);

  const addTodo = useCallback((date, text) => {
    setTodos(prev => {
      const list = prev[date] || [];
      const next = { ...prev, [date]: [...list, { id: Date.now().toString(), text, done: false }] };
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleTodo = useCallback((date, id) => {
    setTodos(prev => {
      const list = (prev[date] || []).map(t => t.id === id ? { ...t, done: !t.done } : t);
      const next = { ...prev, [date]: list };
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeTodo = useCallback((date, id) => {
    setTodos(prev => {
      const list = (prev[date] || []).filter(t => t.id !== id);
      const next = { ...prev, [date]: list };
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateTodo = useCallback((date, id, text) => {
    setTodos(prev => {
      const list = (prev[date] || []).map(t => t.id === id ? { ...t, text } : t);
      const next = { ...prev, [date]: list };
      storageSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { todos, loaded, addTodo, toggleTodo, removeTodo, updateTodo };
}
