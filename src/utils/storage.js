import { Preferences } from '@capacitor/preferences';

export async function storageGet(key) {
  const { value } = await Preferences.get({ key });
  if (value !== null) return value;
  const old = localStorage.getItem(key);
  if (old !== null) {
    await Preferences.set({ key, value: old });
    localStorage.removeItem(key);
    return old;
  }
  return null;
}

export async function storageSet(key, value) {
  await Preferences.set({ key, value });
}
