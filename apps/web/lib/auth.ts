export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  message: string;
  token?: string;
};

declare const process: {
  env: {
    NEXT_PUBLIC_API_BASE_URL?: string;
  };
};

const apiBase = (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined)?.replace(/\/+$/u, '');
const AUTH_TOKEN_KEY = 'nwxt-auth-token';

async function postJson<T>(url: string, payload: object): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function buildAuthUrl(path: string) {
  return apiBase ? `${apiBase}${path}` : `/api/auth${path}`;
}

function buildProfileUrl() {
  return apiBase ? `${apiBase}/profile` : '/api/profile';
}

export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function loginUser(payload: AuthPayload) {
  return postJson<AuthResponse>(buildAuthUrl('/login'), payload);
}

export async function registerUser(payload: AuthPayload) {
  return postJson<AuthResponse>(buildAuthUrl('/register'), payload);
}

export async function fetchProfile() {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No auth token available');
  }

  const response = await fetch(buildProfileUrl(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Profile fetch failed with status ${response.status}`);
  }

  return response.json();
}
