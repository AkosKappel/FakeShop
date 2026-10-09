import { createLocalStore, useStore } from './store';

const API_URL = 'https://dummyjson.com';
const SESSION_MINUTES = 60;

/** Published by DummyJSON for demos: https://dummyjson.com/docs/auth */
export const DEMO_ACCOUNT = { username: 'emilys', password: 'emilyspass' };

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  address: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface Session {
  accessToken: string;
  user: User;
}

// A real shop would keep the token in an httpOnly cookie set by its own
// server; a static site can only keep it in the browser.
export const sessionStore = createLocalStore<Session | null>(
  'fakeshop:session',
  null
);

export function useSession() {
  return useStore(sessionStore);
}

export class AuthError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/** Keeps only what the shop shows; /auth/me also returns sensitive demo data. */
function toUser(data: User): User {
  const { id, username, firstName, lastName, email, image, address } = data;
  return {
    id,
    username,
    firstName,
    lastName,
    email,
    image,
    address: {
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    },
  };
}

async function fetchMe(accessToken: string): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new AuthError(response.status, 'Your session has expired');
  }
  return toUser(await response.json());
}

export async function signIn(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: SESSION_MINUTES,
    }),
  });
  if (!response.ok) {
    throw new AuthError(
      response.status,
      response.status === 400
        ? 'Wrong username or password'
        : 'Signing in failed, please try again'
    );
  }
  const { accessToken } = (await response.json()) as { accessToken: string };
  const user = await fetchMe(accessToken);
  sessionStore.set({ accessToken, user });
  return user;
}

export function signOut() {
  sessionStore.set(null);
}

/** Checks the stored token with the API and signs out when it has expired. */
export async function refreshSession(): Promise<Session | null> {
  const session = sessionStore.get();
  if (!session) return null;
  try {
    const user = await fetchMe(session.accessToken);
    const fresh = { ...session, user };
    sessionStore.set(fresh);
    return fresh;
  } catch (error) {
    if (error instanceof AuthError) {
      signOut();
      return null;
    }
    // Offline or API down: keep the session and show what we have.
    return session;
  }
}
