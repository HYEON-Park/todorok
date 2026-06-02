function isNative() {
  return typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.() === true;
}

async function getPreferences() {
  const { Preferences } = await import('@capacitor/preferences');
  return Preferences;
}

export async function storageGet(key) {
  if (isNative()) {
    const P = await getPreferences();
    const { value } = await P.get({ key });
    if (value !== null) return value;
    // 최초 1회: 기존 WebView localStorage → Preferences 마이그레이션
    const old = localStorage.getItem(key);
    if (old !== null) {
      await P.set({ key, value: old });
      localStorage.removeItem(key);
      return old;
    }
    return null;
  }

  // 웹: 직접 키 확인
  const direct = localStorage.getItem(key);
  if (direct !== null) return direct;

  // 이전 Capacitor 마이그레이션으로 이동된 키 복구
  const capKey = `CapacitorStorage.${key}`;
  const migrated = localStorage.getItem(capKey);
  if (migrated !== null) {
    localStorage.setItem(key, migrated);
    localStorage.removeItem(capKey);
    return migrated;
  }

  return null;
}

export async function storageSet(key, value) {
  if (isNative()) {
    const P = await getPreferences();
    await P.set({ key, value });
  } else {
    localStorage.setItem(key, value);
  }
}
