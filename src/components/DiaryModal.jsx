import { useEffect } from 'react';

export default function DiaryModal({ diary, onClose, onEdit, onDelete }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!diary) return null;

  function handleDelete() {
    if (window.confirm('정말 이 일기를 삭제하시겠습니까?')) onDelete(diary.date);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <p className="modal-date">{diary.date}{diary.emoji && <span className="modal-emoji">{diary.emoji}</span>}</p>
        <h2 className="modal-title">{diary.title}</h2>
        <div className="modal-content">{diary.content}</div>
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>달력으로</button>
          <div className="modal-actions-right">
            <button className="btn-ghost" onClick={() => onEdit(diary.date)}>수정</button>
            <button className="btn-danger" onClick={handleDelete}>삭제</button>
          </div>
        </div>
      </div>
    </div>
  );
}
