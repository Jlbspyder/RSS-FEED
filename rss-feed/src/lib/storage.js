const storage = typeof window !== 'undefined' ? localStorage : null;

export function readStorage(key, fallback) {
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);

    if (!raw) return fallback;

    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to read storage for key: ${key}`, error);

    return fallback;
  }
}

export function writeStorage(key, value) {
   if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write storage for key: ${key}`, error);
  }
}