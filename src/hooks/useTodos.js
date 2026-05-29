import { useState, useCallback } from 'react';

const STORAGE_KEY = 'todorok-todos';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useTodos() {
  const [todos, setTodos] = useState(load);

  const addTodo = useCallback((date, text) => {
    setTodos(prev => {
      const list = prev[date] || [];
      const next = { ...prev, [date]: [...list, { id: Date.now().toString(), text, done: false }] };
      save(next);
      return next;
    });
  }, []);

  const toggleTodo = useCallback((date, id) => {
    setTodos(prev => {
      const list = (prev[date] || []).map(t => t.id === id ? { ...t, done: !t.done } : t);
      const next = { ...prev, [date]: list };
      save(next);
      return next;
    });
  }, []);

  const removeTodo = useCallback((date, id) => {
    setTodos(prev => {
      const list = (prev[date] || []).filter(t => t.id !== id);
      const next = { ...prev, [date]: list };
      save(next);
      return next;
    });
  }, []);

  const updateTodo = useCallback((date, id, text) => {
    setTodos(prev => {
      const list = (prev[date] || []).map(t => t.id === id ? { ...t, text } : t);
      const next = { ...prev, [date]: list };
      save(next);
      return next;
    });
  }, []);

  return { todos, addTodo, toggleTodo, removeTodo, updateTodo };
}
