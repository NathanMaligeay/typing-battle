// utils/api.ts
const BASE_URL = 'http://localhost:5105/api';

export const registerUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/account/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
};

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/account/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
};

export const sendEndGameInfo = async (username: string | null, wordsTyped: number, accuracy: number, score: number) => {
  const response = await fetch(`${BASE_URL}/game/${encodeURIComponent(username || '')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wordsTyped, accuracy, score }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}

export const getNumberGames = async (username: string | null) => {
  try {
    const response = await fetch(`${BASE_URL}/game/username/stats?username=${encodeURIComponent(username || '')}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) throw new Error(`Failed to fetch game count: ${error.message}`);
  }
}

export const getAllGames = async (username: string | null) => {
  try {
    const response = await fetch(`${BASE_URL}/game/username?username=${encodeURIComponent(username || '')}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) throw new Error(`Failed to fetch all games: ${error.message}`);
  }
}
