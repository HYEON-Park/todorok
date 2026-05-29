import { useState } from 'react';

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

export default function DdayPage({ ddays, addDday, removeDday }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  function handleAdd() {
    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!date) { alert('날짜를 선택해주세요.'); return; }
    addDday(title.trim(), date);
    setTitle('');
    setDate('');
    setShowForm(false);
  }

  return (
    <div className="dday-page">
      <div className="dday-header">
        <h2 className="page-title">디데이</h2>
        <button className="btn-add" onClick={() => setShowForm(v => !v)}>
          {showForm ? '×' : '+'}
        </button>
      </div>

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
            <li key={d.id} className="dday-item">
              <span className={ddayClass(d.date)}>{calcDday(d.date)}</span>
              <div className="dday-info">
                <p className="dday-title">{d.title}</p>
                <p className="dday-date-label">{d.date}</p>
              </div>
              <button
                className="dday-remove"
                onClick={() => { if (window.confirm('이 디데이를 삭제하시겠습니까?')) removeDday(d.id); }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <line x1="1" y1="1" x2="11" y2="11"/>
                  <line x1="11" y1="1" x2="1" y2="11"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
