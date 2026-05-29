import { useState, useEffect } from 'react';
import DiaryForm from './DiaryForm';

export default function DiaryListPage({ diaries, updateDiary, removeDiary, registerBackHandler }) {
  const [detailDate, setDetailDate] = useState(null);
  const [editDate, setEditDate] = useState(null);

  useEffect(() => {
    if (detailDate || editDate) {
      registerBackHandler?.(() => {
        if (editDate) setEditDate(null);
        else setDetailDate(null);
      });
    } else {
      registerBackHandler?.(null);
    }
    return () => registerBackHandler?.(null);
  }, [detailDate, editDate]);

  const sorted = Object.values(diaries).sort((a, b) => b.date.localeCompare(a.date));

  if (editDate) {
    return (
      <div className="diary-list-page">
        <DiaryForm
          date={editDate}
          initial={diaries[editDate]}
          onSave={(title, content, emoji) => {
            updateDiary(editDate, title, content, emoji);
            setDetailDate(editDate);
            setEditDate(null);
          }}
          onCancel={() => setEditDate(null)}
        />
      </div>
    );
  }

  if (detailDate && diaries[detailDate]) {
    const diary = diaries[detailDate];
    return (
      <div className="diary-list-page">
        <div className="detail-page">
          <button className="btn-back" onClick={() => setDetailDate(null)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="10 3 5 8 10 13"/>
            </svg>
            목록
          </button>
          <p className="detail-date">
            <span>{diary.date}</span>
            {diary.emoji && <span className="detail-emoji">{diary.emoji}</span>}
          </p>
          <h2 className="detail-title">{diary.title}</h2>
          <div className="detail-content">{diary.content}</div>
          <div className="detail-actions">
            <button className="btn-ghost" onClick={() => setEditDate(detailDate)}>수정</button>
            <button className="btn-danger" onClick={() => {
              if (window.confirm('정말 이 일기를 삭제하시겠습니까?')) {
                removeDiary(detailDate);
                setDetailDate(null);
              }
            }}>삭제</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diary-list-page">
      <h2 className="page-title">일기 목록</h2>
      {sorted.length === 0 ? (
        <p className="empty-msg">작성된 일기가 없습니다.</p>
      ) : (
        <ul className="diary-board">
          {sorted.map((diary, i) => (
            <li
              key={diary.date}
              className="diary-board-item"
              onClick={() => setDetailDate(diary.date)}
            >
              <span className="board-num">{sorted.length - i}</span>
              <span className="board-title">{diary.title}</span>
              <span className="board-date">{diary.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
