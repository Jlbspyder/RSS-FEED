const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchGuestFeeds() {
  const response = await fetch(`${API_BASE_URL}/api/guest-feeds`);

  if (!response.ok) {
    throw new Error('Failed to fetch guest feeds.');
  }

  return response.json();
}