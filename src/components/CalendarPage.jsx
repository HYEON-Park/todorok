import { useState } from 'react';
import Calendar from './Calendar';
import DiaryModal from './DiaryModal';
import MonthYearPicker from './MonthYearPicker';
import TodoSection from './TodoSection';

const _today = new Date();

function todayStr() {
  const y = _today.getFullYear();
  const m = String(_today.getMonth() + 1).padStart(2, '0');
  const d = String(_today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function pad(n) { return String(n).padStart(2, '0'); }

export default function CalendarPage({ diaries, todos, addTodo, toggleTodo, removeTodo, onCreateDiary, onEditDiary, onDeleteDiary }) {
  const [year, setYear] = useState(_today.getFullYear());
  const [month, setMonth] = useState(_today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [modalDiaryDate, setModalDiaryDate] = useState(null);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  function handleDateClick(date) {
    setSelectedDate(date);
  }

  const hasDiary = !!(selectedDate && diaries[selectedDate]);

  return (
    <div className="calendar-page">
      <header className="cal-header">
        <div className="cal-nav">
          <button className="nav-btn" onClick={prevMonth}>&#8249;</button>
          <button
            className="nav-pick-btn"
            onClick={() => { setYearPickerOpen(true); setMonthPickerOpen(false); }}
          >
            {year}년
          </button>
          <button
            className="nav-pick-btn"
            onClick={() => { setMonthPickerOpen(true); setYearPickerOpen(false); }}
          >
            {pad(month)}월
          </button>
          <button className="nav-btn" onClick={nextMonth}>&#8250;</button>
        </div>
        <div className="cal-actions">
          <button
            className={`btn-action${hasDiary ? ' disabled' : ''}`}
            disabled={hasDiary || !selectedDate}
            onClick={() => selectedDate && !hasDiary && onCreateDiary(selectedDate)}
            title={hasDiary ? '이미 일기가 있습니다' : '일기 쓰기'}
          >
            일기
          </button>
        </div>
      </header>

      {yearPickerOpen && (
        <MonthYearPicker
          type="year"
          current={year}
          onChange={y => { setYear(y); setYearPickerOpen(false); }}
          onClose={() => setYearPickerOpen(false)}
        />
      )}
      {monthPickerOpen && (
        <MonthYearPicker
          type="month"
          current={month}
          onChange={m => { setMonth(m); setMonthPickerOpen(false); }}
          onClose={() => setMonthPickerOpen(false)}
        />
      )}

      <Calendar
        year={year}
        month={month}
        diaries={diaries}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
        onDiaryClick={setModalDiaryDate}
      />

      <TodoSection
        date={selectedDate}
        todos={todos}
        onAdd={text => addTodo(selectedDate, text)}
        onToggle={toggleTodo}
        onRemove={removeTodo}
      />

      {modalDiaryDate && (
        <DiaryModal
          diary={diaries[modalDiaryDate]}
          onClose={() => setModalDiaryDate(null)}
          onEdit={() => { setModalDiaryDate(null); onEditDiary(modalDiaryDate); }}
          onDelete={() => { onDeleteDiary(modalDiaryDate); setModalDiaryDate(null); }}
        />
      )}
    </div>
  );
}
