import { useState } from 'react';

const STORAGE_KEYS = [
  'todorok-entries',
  'todorok-todos',
  'todorok-ddays',
];
const NOTIF_KEY = 'todorok-notification';

function loadNotifSettings() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || 'null') || { enabled: false, hour: 21, minute: 0 };
  } catch { return { enabled: false, hour: 21, minute: 0 }; }
}

async function scheduleNotification(hour, minute) {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') { alert('알림 권한이 필요합니다. 설정에서 허용해 주세요.'); return false; }
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
    await LocalNotifications.schedule({
      notifications: [{
        title: 'todorok',
        body: '오늘의 일기를 작성해보세요 ✍️',
        id: 1,
        schedule: { every: 'day', on: { hour, minute } },
      }],
    });
    return true;
  } catch (e) {
    console.warn('Notification scheduling failed:', e);
    return false;
  }
}

async function cancelNotification() {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  } catch (e) {
    console.warn('Notification cancel failed:', e);
  }
}

export default function SettingsPage({ darkMode, setDarkMode }) {
  const [notif, setNotif] = useState(loadNotifSettings);
  const [saving, setSaving] = useState(false);

  function handleExport() {
    const data = {};
    STORAGE_KEYS.forEach(key => {
      const raw = localStorage.getItem(key);
      if (raw) data[key] = JSON.parse(raw);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocketdiary-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        STORAGE_KEYS.forEach(key => {
          if (data[key] !== undefined) localStorage.setItem(key, JSON.stringify(data[key]));
        });
        alert('복원이 완료되었습니다. 앱을 새로고침합니다.');
        window.location.reload();
      } catch {
        alert('올바른 백업 파일이 아닙니다.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  async function handleNotifSave() {
    setSaving(true);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notif));
    if (notif.enabled) {
      const ok = await scheduleNotification(notif.hour, notif.minute);
      if (ok) alert(`매일 ${String(notif.hour).padStart(2, '0')}:${String(notif.minute).padStart(2, '0')} 알림이 설정되었습니다.`);
    } else {
      await cancelNotification();
      alert('알림이 해제되었습니다.');
    }
    setSaving(false);
  }

  return (
    <div className="settings-page">
      <h2 className="page-title">설정</h2>

      <section className="settings-section">
        <h3 className="settings-section-title">테마</h3>
        <div className="settings-item">
          <div className="settings-item-info">
            <p className="settings-item-label">다크모드</p>
            <p className="settings-item-desc">화면을 어두운 테마로 전환합니다.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={e => setDarkMode(e.target.checked)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h3 className="settings-section-title">백업 / 복원</h3>
        <div className="settings-item">
          <div className="settings-item-info">
            <p className="settings-item-label">데이터 내보내기</p>
            <p className="settings-item-desc">일기, 할 일, 디데이 데이터를 JSON 파일로 저장합니다.</p>
          </div>
          <button className="btn-primary" onClick={handleExport}>내보내기</button>
        </div>
        <div className="settings-item">
          <div className="settings-item-info">
            <p className="settings-item-label">데이터 가져오기</p>
            <p className="settings-item-desc">백업된 JSON 파일을 불러와 데이터를 복원합니다.</p>
          </div>
          <label className="btn-ghost settings-import-label">
            가져오기
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h3 className="settings-section-title">알림 설정</h3>
        <div className="settings-item">
          <div className="settings-item-info">
            <p className="settings-item-label">일기 작성 알림</p>
            <p className="settings-item-desc">매일 설정한 시간에 일기 작성을 알려드립니다.</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notif.enabled}
              onChange={e => setNotif(n => ({ ...n, enabled: e.target.checked }))}
            />
            <span className="toggle-slider" />
          </label>
        </div>
        {notif.enabled && (
          <div className="settings-time-row">
            <span className="settings-time-label">알림 시간</span>
            <div className="settings-time-inputs">
              <select
                className="settings-select"
                value={notif.hour}
                onChange={e => setNotif(n => ({ ...n, hour: Number(e.target.value) }))}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}시</option>
                ))}
              </select>
              <select
                className="settings-select"
                value={notif.minute}
                onChange={e => setNotif(n => ({ ...n, minute: Number(e.target.value) }))}
              >
                {[0, 10, 20, 30, 40, 50].map(m => (
                  <option key={m} value={m}>{String(m).padStart(2, '0')}분</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div className="settings-save-row">
          <button className="btn-primary" onClick={handleNotifSave} disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </section>
    </div>
  );
}
