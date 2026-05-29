import { isHoliday } from '../utils/holidays';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDate(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function buildGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= lastDate; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function Calendar({ year, month, diaries, selectedDate, onDateClick, onDiaryClick }) {
  const today = new Date();
  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const cells = buildGrid(year, month);
  const rows = cells.length / 7;

  return (
    <div className="calendar">
      <div className="calendar-header">
        {DAY_LABELS.map(d => (
          <div key={d} className={`day-label${d === '일' ? ' sun' : d === '토' ? ' sat' : ''}`}>{d}</div>
        ))}
      </div>
      <div className="calendar-grid" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="cell empty" />;
          const dateStr = formatDate(year, month, day);
          const diary = diaries[dateStr];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const isSun = i % 7 === 0;
          const isSat = i % 7 === 6;
          const isHol = !isSun && isHoliday(dateStr);

          return (
            <div
              key={dateStr}
              className={`cell${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${isSun ? ' sun' : ''}${isSat ? ' sat' : ''}${isHol ? ' holiday' : ''}`}
              onClick={() => onDateClick(dateStr)}
            >
              <div className="cell-date-row">
                <span className="day-num">{day}</span>
                {diary?.emoji && <span className="cell-diary-emoji">{diary.emoji}</span>}
              </div>
              {diary && (
                <button
                  className="diary-title"
                  onClick={e => { e.stopPropagation(); onDiaryClick(dateStr); }}
                >
                  {diary.title}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
