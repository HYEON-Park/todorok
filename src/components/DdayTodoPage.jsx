import { useState, useEffect } from 'react';

function calcDday(targetDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  const diff = Math.floor((target - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

function ddayClass(targetDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  const diff = Math.floor((target - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'dday-count dday-today';
  if (diff > 0) return 'dday-count dday-future';
  return 'dday-count dday-past';
}

export default function DdayTodoPage({ ddays, addDday, removeDday, updateDday, todos, toggleTodo, removeTodo, updateTodo, registerBackHandler }) {
  const [activeTab, setActiveTab] = useState('dday');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [todoEditingId, setTodoEditingId] = useState(null);
  const [todoEditText, setTodoEditText] = useState('');

  useEffect(() => {
    return () => registerBackHandler?.(null);
  }, []);

  function handleAdd() {
    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!date) { alert('날짜를 선택해주세요.'); return; }
    addDday(title.trim(), date);
    setTitle('');
    setDate('');
    setShowForm(false);
  }

  function handleEditStart(d) {
    setShowForm(false);
    setEditingId(d.id);
    setEditTitle(d.title);
    setEditDate(d.date);
  }

  function handleEditSave() {
    if (!editTitle.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!editDate) { alert('날짜를 선택해주세요.'); return; }
    updateDday(editingId, editTitle.trim(), editDate);
    setEditingId(null);
  }

  function handleEditCancel() {
    setEditingId(null);
  }

  function handleTodoEditStart(t) {
    setTodoEditingId(t.id);
    setTodoEditText(t.text);
  }

  function handleTodoEditSave(date) {
    if (!todoEditText.trim()) { alert('내용을 입력해주세요.'); return; }
    updateTodo(date, todoEditingId, todoEditText.trim());
    setTodoEditingId(null);
  }

  function handleTodoEditCancel() {
    setTodoEditingId(null);
  }

  const incompleteTodos = Object.entries(todos)
    .flatMap(([d, list]) => list.filter(t => !t.done).map(t => ({ ...t, date: d })))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="dday-page">
      <div className="dday-header">
        <h2 className="page-title">D-day / todo</h2>
        {activeTab === 'dday' && (
          <button className="btn-add" onClick={() => setShowForm(v => !v)}>
            {showForm ? '×' : '+'}
          </button>
        )}
      </div>

      <div className="inner-tabs">
        <button
          className={`inner-tab${activeTab === 'dday' ? ' active' : ''}`}
          onClick={() => { setActiveTab('dday'); setShowForm(false); }}
        >
          D-day
        </button>
        <button
          className={`inner-tab${activeTab === 'todo' ? ' active' : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          Todo
        </button>
      </div>

      {activeTab === 'dday' && (
        <>
          {showForm && (
            <div className="dday-form">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="디데이 제목"
                className="dday-input"
                autoFocus
              />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                onClick={e => e.target.showPicker?.()}
                className="dday-input"
              />
              <div className="dday-form-actions">
                <button className="btn-ghost" onClick={() => { setShowForm(false); setTitle(''); setDate(''); }}>취소</button>
                <button className="btn-primary" onClick={handleAdd}>저장</button>
              </div>
            </div>
          )}

          {ddays.length === 0 && !showForm ? (
            <p className="empty-msg">디데이가 없습니다. + 버튼으로 추가하세요.</p>
          ) : (
            <ul className="dday-list">
              {ddays.map(d => (
                editingId === d.id ? (
                  <li key={d.id} className="dday-item dday-item-editing">
                    <div className="dday-edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        placeholder="디데이 제목"
                        className="dday-input"
                        autoFocus
                      />
                      <input
                        type="date"
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        onClick={e => e.target.showPicker?.()}
                        className="dday-input"
                      />
                      <div className="dday-form-actions">
                        <button className="btn-ghost" onClick={handleEditCancel}>취소</button>
                        <button className="btn-primary" onClick={handleEditSave}>저장</button>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li key={d.id} className="dday-item">
                    <span className={ddayClass(d.date)}>{calcDday(d.date)}</span>
                    <div className="dday-info">
                      <p className="dday-title">{d.title}</p>
                      <p className="dday-date-label">{d.date}</p>
                    </div>
                    <div className="dday-actions">
                      <button className="dday-edit" onClick={() => handleEditStart(d)}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M9 2l2 2-7 7H2v-2L9 2z"/>
                        </svg>
                      </button>
                      <button
                        className="dday-remove"
                        onClick={() => { if (window.confirm('이 디데이를 삭제하시겠습니까?')) removeDday(d.id); }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <line x1="1" y1="1" x2="11" y2="11"/>
                          <line x1="11" y1="1" x2="1" y2="11"/>
                        </svg>
                      </button>
                    </div>
                  </li>
                )
              ))}
            </ul>
          )}
        </>
      )}

      {activeTab === 'todo' && (
        <>
          {incompleteTodos.length === 0 ? (
            <p className="empty-msg">미완료 Todo가 없습니다.</p>
          ) : (
            <ul className="todo-tab-list">
              {incompleteTodos.map(t => (
                <li key={t.id} className="todo-tab-item">
                  <button
                    className="todo-check"
                    onClick={() => toggleTodo(t.date, t.id)}
                  />
                  {todoEditingId === t.id ? (
                    <div className="todo-tab-edit-form">
                      <input
                        className="todo-tab-edit-input"
                        value={todoEditText}
                        onChange={e => setTodoEditText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleTodoEditSave(t.date); if (e.key === 'Escape') handleTodoEditCancel(); }}
                        autoFocus
                      />
                      <div className="todo-tab-edit-actions">
                        <button className="btn-ghost" onClick={handleTodoEditCancel}>취소</button>
                        <button className="btn-primary" onClick={() => handleTodoEditSave(t.date)}>저장</button>
                      </div>
                    </div>
                  ) : (
                    <div className="todo-tab-info">
                      <span className="todo-text">{t.text}</span>
                      <span className="todo-tab-date">{t.date}</span>
                    </div>
                  )}
                  {todoEditingId !== t.id && (
                    <div className="todo-tab-actions">
                      <button className="todo-edit" onClick={() => handleTodoEditStart(t)}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M9 2l2 2-7 7H2v-2L9 2z"/>
                        </svg>
                      </button>
                      <button className="todo-remove" onClick={() => { if (window.confirm('이 할 일을 삭제하시겠습니까?')) removeTodo(t.date, t.id); }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <line x1="1" y1="1" x2="11" y2="11"/>
                          <line x1="11" y1="1" x2="1" y2="11"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
