import { serverApiClient } from '@/lib/api-client-server';
import { getServerAccessToken } from '@/utils/jwt-tokens';
import { cache } from 'react';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  date_joined?: string;
}

export const getCachedLoggedInVerifiedSupabaseUser = cache(async () => {
  const token = await getServerAccessToken();
  if (!token) {
    throw new Error('No user found');
  }

  try {
    const user = await serverApiClient.getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }
    return {
      user: {
        id: String(user.id),
        email: user.email,
        full_name: user.full_name,
      },
    };
  } catch (error) {
    throw new Error('No user found');
  }
});

export const getCachedLoggedInSupabaseUser = cache(async () => {
  const token = await getServerAccessToken();
  if (!token) {
    throw new Error('No user found');
  }

  try {
    const user = await serverApiClient.getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }
    return {
      id: String(user.id),
      email: user.email,
      full_name: user.full_name,
    } as any;
  } catch {
    throw new Error('No user found');
  }
});

export const getCachedLoggedInUserClaims = cache(async () => {
  const token = await getServerAccessToken();
  if (!token) {
    throw new Error('No claims found');
  }

  try {
    const user = await serverApiClient.getCurrentUser();
    if (!user) {
      throw new Error('No claims found');
    }
    return {
      sub: String(user.id),
      email: user.email,
    };
  } catch {
    throw new Error('No claims found');
  }
});

export const getCachedIsUserLoggedIn = cache(async () => {
  const token = await getServerAccessToken();
  if (!token) {
    return false;
  }

  try {
    const user = await serverApiClient.getCurrentUser();
    return user !== null;
  } catch {
    return false;
  }
});

export const getCachedLoggedInUserId = cache(async () => {
  try {
    const claims = await getCachedLoggedInUserClaims();
    return claims.sub;
  } catch (error) {
    return null;
  }
});
