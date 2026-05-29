import { useEffect } from 'react';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}월` }));
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030].map(y => ({ value: y, label: `${y}` }));

export default function MonthYearPicker({ type, current, onChange, onClose }) {
  const items = type === 'month' ? MONTHS : YEARS;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="picker-backdrop" onClick={onClose}>
      <div className={`picker-popup picker-${type}`} onClick={e => e.stopPropagation()}>
        <div className="picker-grid">
          {items.map(item => (
            <button
              key={item.value}
              className={`picker-item${item.value === current ? ' active' : ''}`}
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
