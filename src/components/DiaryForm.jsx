import { useState, useEffect, useRef } from 'react';

export default function DiaryForm({ date, initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [emoji, setEmoji] = useState(initial?.emoji || '');
  const [emojiEditing, setEmojiEditing] = useState(false);
  const [editCount, setEditCount] = useState(0);
  const emojiInputRef = useRef(null);

  useEffect(() => {
    if (emojiEditing && emojiInputRef.current) {
      emojiInputRef.current.focus();
    }
  }, [emojiEditing]);

  function startEmojiEditing() {
    setEditCount(c => c + 1);
    setEmojiEditing(true);
  }

  useEffect(() => {
    setTitle(initial?.title || '');
    setContent(initial?.content || '');
    setEmoji(initial?.emoji || '');
  }, [initial]);

  const isDirty =
    title !== (initial?.title || '') ||
    content !== (initial?.content || '') ||
    emoji !== (initial?.emoji || '');

  function handleCancel() {
    if (isDirty && !window.confirm('작성 중인 내용이 있습니다. 취소하시겠습니까?')) return;
    onCancel();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
    if (!content.trim()) { alert('내용을 입력해주세요.'); return; }
    onSave(title.trim(), content.trim(), emoji);
  }

  function handleEmojiChange(e) {
    const val = e.target.value;
    if (!val) return;
    try {
      const first = [...new Intl.Segmenter().segment(val)][0]?.segment;
      if (first) { setEmoji(first); setEmojiEditing(false); }
    } catch {
      setEmoji(val[0]);
      setEmojiEditing(false);
    }
  }

  const isEdit = !!initial;

  return (
    <div className="form-page">
      <div className="form-title-row">
        <h2 className="form-title">{isEdit ? '일기 수정' : '일기 쓰기'}</h2>
        <div className="form-emoji-box">
          {emojiEditing ? (
            <>
              <input
                key={editCount}
                ref={emojiInputRef}
                className="form-emoji-input"
                defaultValue=""
                onChange={handleEmojiChange}
                onBlur={() => setEmojiEditing(false)}
                onKeyDown={e => { if (e.key === 'Escape') setEmojiEditing(false); }}
              />
              <span className="form-emoji-hint">Win+;</span>
            </>
          ) : (
            <button
              type="button"
              className="form-emoji-btn"
              onClick={startEmojiEditing}
              title="emoji"
            >
              {emoji || '🍀'}
            </button>
          )}
        </div>
      </div>
      <p className="form-date">{date}</p>
      <form onSubmit={handleSubmit} className="diary-form">
        <div className="field">
          <label>제목</label>
          <input
            type="text"
            maxLength={50}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="오늘의 제목 (최대 50자)"
          />
          <span className="char-count">{title.length}/50</span>
        </div>
        <div className="field">
          <label>내용</label>
          <textarea
            rows={10}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="오늘 하루를 기록해보세요..."
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={handleCancel}>취소</button>
          <button type="submit" className="btn-primary">{isEdit ? '수정 완료' : '저장'}</button>
        </div>
      </form>
    </div>
  );
}
