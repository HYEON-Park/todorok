import { useState, useEffect } from 'react';

export default function TodoSection({ date, todos, onAdd, onToggle, onRemove }) {
  const [showInput, setShowInput] = useState(false);
  const [text, setText] = useState('');
  const list = (date && todos[date]) || [];

  useEffect(() => {
    setShowInput(false);
    setText('');
  }, [date]);

  function handleAdd() {
    if (!text.trim()) return;
    onAdd(text.trim());
    setText('');
  }

  return (
    <div className="todo-section">
      <div className="todo-section-header">
        <p className="todo-section-label">
          {date ? `${date}` : '날짜를 선택하세요'} · 할 일
        </p>
        <button
          className={`btn-action${showInput ? ' active-action' : ''}`}
          onClick={() => setShowInput(v => !v)}
        >
          todo
        </button>
      </div>

      {list.length === 0 && !showInput && (
        <p className="todo-empty">할 일이 없습니다.</p>
      )}

      {list.length > 0 && (
        <ul className="todo-list">
          {list.map(todo => (
            <li key={todo.id} className={`todo-item${todo.done ? ' done' : ''}`}>
              <button
                className={`todo-check${todo.done ? ' checked' : ''}`}
                onClick={() => onToggle(date, todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
              <button className="todo-delete" onClick={() => onRemove(date, todo.id)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="1" y1="1" x2="11" y2="11"/>
                  <line x1="11" y1="1" x2="1" y2="11"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {showInput && (
        <div className="todo-input-row">
          <input
            type="text"
            value={text}
            maxLength={17}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') { setShowInput(false); setText(''); }
            }}
            placeholder="할 일 입력 (최대 17자)"
            autoFocus
          />
          <span className="todo-char">{text.length}/17</span>
          <button className="todo-confirm" onClick={handleAdd}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="2 7 6 11 12 3"/>
            </svg>
          </button>
          <button className="todo-cancel" onClick={() => { setShowInput(false); setText(''); }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11"/>
              <line x1="11" y1="1" x2="1" y2="11"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
