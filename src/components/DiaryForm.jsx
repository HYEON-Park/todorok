import { useState, useEffect, useRef } from 'react';

export default function DiaryForm({ date, initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [content, setContent] = useState(initial?.content || '');
  const [emoji, setEmoji] = useState(initial?.emoji || '');
  const emojiInputRef = useRef(null);
  const emojiValueRef = useRef(initial?.emoji || '');

  useEffect(() => {
    const e = initial?.emoji || '';
    setTitle(initial?.title || '');
    setContent(initial?.content || '');
    setEmoji(e);
    emojiValueRef.current = e;
    if (emojiInputRef.current) emojiInputRef.current.value = e || '🍀';
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
    onSave(title.trim(), content.trim(), emoji || '🍀');
  }

  function handleEmojiClick() {
    setEmoji('');
    emojiValueRef.current = '';
    if (emojiInputRef.current) {
      emojiInputRef.current.value = '';
      emojiInputRef.current.focus();
    }
  }

  function handleEmojiBlur() {
    if (!emojiValueRef.current && emojiInputRef.current) {
      emojiInputRef.current.value = '🍀';
    }
  }

  function handleEmojiChange(e) {
    const val = e.target.value;
    if (!val) { setEmoji(''); emojiValueRef.current = ''; return; }
    let last;
    try {
      const segments = [...new Intl.Segmenter().segment(val)];
      last = segments.at(-1)?.segment;
    } catch {
      last = [...val].at(-1) || val[0];
    }
    if (last) {
      setEmoji(last);
      emojiValueRef.current = last;
      e.target.value = last;
    }
  }

  const isEdit = !!initial;

  return (
    <div className="form-page">
      <div className="form-title-row">
        <h2 className="form-title">{isEdit ? '일기 수정' : '일기 쓰기'}</h2>
        <div className="form-emoji-box">
          <input
            ref={emojiInputRef}
            className="form-emoji-btn"
            defaultValue={emoji || '🍀'}
            onClick={handleEmojiClick}
            onChange={handleEmojiChange}
            onBlur={handleEmojiBlur}
          />
          {!emoji && <span className="form-emoji-hint">Win+;</span>}
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
