const CalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2" y="3" width="18" height="17" rx="2"/>
    <line x1="7" y1="1" x2="7" y2="5"/>
    <line x1="15" y1="1" x2="15" y2="5"/>
    <line x1="2" y1="9" x2="20" y2="9"/>
  </svg>
);

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M4 19A2.5 2.5 0 016.5 16.5H18"/>
    <path d="M6.5 2H18v18H6.5A2.5 2.5 0 014 17.5v-13A2.5 2.5 0 016.5 2z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="11" cy="11" r="9"/>
    <polyline points="11 6 11 11 15 13.5"/>
  </svg>
);

const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="11" cy="11" r="3"/>
    <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 17.07l1.41-1.41M15.66 6.34l1.41-1.41"/>
  </svg>
);

const TABS = [
  { key: 'calendar', label: '달력', Icon: CalIcon },
  { key: 'diary', label: '일기', Icon: BookIcon },
  { key: 'ddaytodo', label: 'D-todo', Icon: ClockIcon },
  { key: 'settings', label: '설정', Icon: GearIcon },
];

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ key, label, Icon }) => (
        <button
          key={key}
          className={`bottom-nav-btn${activeTab === key ? ' active' : ''}`}
          onClick={() => onChange(key)}
        >
          <Icon />
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
