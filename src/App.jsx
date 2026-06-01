import { useState, useRef, useEffect, useCallback } from 'react';
import Splash from './components/Splash';
import BottomNav from './components/BottomNav';
import CalendarPage from './components/CalendarPage';
import DiaryListPage from './components/DiaryListPage';
import DdayTodoPage from './components/DdayTodoPage';
import SettingsPage from './components/SettingsPage';
import DiaryForm from './components/DiaryForm';
import { useDiaries } from './hooks/useDiaries';
import { useTodos } from './hooks/useTodos';
import { useDdays } from './hooks/useDdays';

const DARK_MODE_KEY = 'todorok-darkmode';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  const [formMode, setFormMode] = useState(null);
  const [formDate, setFormDate] = useState(null);
  const [calInitialDate, setCalInitialDate] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_MODE_KEY) === 'true');

  const { diaries, create, update, remove } = useDiaries();
  const { todos, addTodo, toggleTodo, removeTodo, updateTodo } = useTodos();
  const { ddays, addDday, removeDday, updateDday } = useDdays();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(DARK_MODE_KEY, darkMode);
  }, [darkMode]);

  // Back button handling
  const subNavHandlerRef = useRef(null);
  const capAppRef = useRef(null);
  const backPressRef = useRef(null);

  const registerBackHandler = useCallback((fn) => {
    subNavHandlerRef.current = fn;
  }, []);

  // Keep backPressRef always pointing to latest state
  backPressRef.current = () => {
    if (subNavHandlerRef.current) {
      subNavHandlerRef.current();
    } else if (formMode) {
      setFormMode(null);
      setFormDate(null);
    } else if (activeTab !== 'calendar') {
      subNavHandlerRef.current = null;
      setActiveTab('calendar');
    } else {
      capAppRef.current?.exitApp();
    }
  };

  useEffect(() => {
    let listenerHandle;
    async function setup() {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        capAppRef.current = CapApp;
        listenerHandle = await CapApp.addListener('backButton', () => {
          backPressRef.current?.();
        });
      } catch {
        // Not in Capacitor native environment
      }
    }
    setup();
    return () => { listenerHandle?.remove(); };
  }, []);

  function handleTabChange(tab) {
    subNavHandlerRef.current = null;
    setActiveTab(tab);
  }

  function openCreate(date) { setFormDate(date); setFormMode('create'); }
  function openEdit(date) { setFormDate(date); setFormMode('edit'); }

  function handleSave(title, content, emoji) {
    if (formMode === 'create') create(formDate, title, content, emoji);
    else update(formDate, title, content, emoji);
    setCalInitialDate(formDate);
    setFormMode(null);
    setFormDate(null);
  }

  function handleCancel() {
    setCalInitialDate(formDate);
    setFormMode(null);
    setFormDate(null);
  }

  if (!splashDone) {
    return <Splash onDone={() => setSplashDone(true)} />;
  }

  if (formMode) {
    return (
      <div className="app">
        <DiaryForm
          date={formDate}
          initial={formMode === 'edit' ? diaries[formDate] : null}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="app with-bottom-nav">
      {activeTab === 'calendar' && (
        <CalendarPage
          diaries={diaries}
          todos={todos}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
          onCreateDiary={openCreate}
          onEditDiary={openEdit}
          onDeleteDiary={remove}
          initialDate={calInitialDate}
        />
      )}
      {activeTab === 'diary' && (
        <DiaryListPage
          diaries={diaries}
          updateDiary={update}
          removeDiary={remove}
          registerBackHandler={registerBackHandler}
        />
      )}
      {activeTab === 'ddaytodo' && (
        <DdayTodoPage
          ddays={ddays}
          addDday={addDday}
          removeDday={removeDday}
          updateDday={updateDday}
          todos={todos}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
          registerBackHandler={registerBackHandler}
        />
      )}
      {activeTab === 'settings' && (
        <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />
      )}
      <BottomNav activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
}
