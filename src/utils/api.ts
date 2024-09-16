// utils/api.ts
const BASE_URL = 'http://localhost:8080';

export const registerUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
};

export const loginUser = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
};
