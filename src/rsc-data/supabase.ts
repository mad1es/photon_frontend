import { createSupabaseClient } from '@/supabase-clients/server';
import { getDevUserId, hasDevSession, isDevAuthEnabled } from '@/utils/dev-auth';
import { cache } from 'react';

// Only meant to be used in protected pages
// This makes an extra call to the server to verify the user is still logged in
// Use sparingly
export const getCachedLoggedInVerifiedSupabaseUser = cache(async () => {
  if (isDevAuthEnabled()) {
    const hasSession = await hasDevSession();
    if (hasSession) {
      return {
        user: {
          id: await getDevUserId() || 'dev-user-id',
          email: 'dev@example.com',
        },
      };
    }
    throw new Error('No user found');
  }

  const supabase = await createSupabaseClient();
  if (!supabase) {
    // Если Supabase не настроен, возвращаем дефолтного пользователя
    return {
      user: {
        id: 'default-user-id',
        email: 'user@example.com',
      },
    };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data;
});

// Only meant to be used in protected pages
// This doesn't verify the token with the server, it only validates the stored token
export const getCachedLoggedInSupabaseUser = cache(async () => {
  if (isDevAuthEnabled()) {
    const hasSession = await hasDevSession();
    if (hasSession) {
      return {
        id: await getDevUserId() || 'dev-user-id',
        email: 'dev@example.com',
      } as any;
    }
    throw new Error('No user found');
  }

  const supabase = await createSupabaseClient();
  if (!supabase) {
    // Если Supabase не настроен, возвращаем дефолтного пользователя
    return {
      id: 'default-user-id',
      email: 'user@example.com',
    } as any;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  if (!data.session?.user) {
    throw new Error('No user found');
  }
  return data.session.user;
});

export const getCachedLoggedInUserClaims = cache(async () => {
  if (isDevAuthEnabled()) {
    const userId = await getDevUserId();
    if (userId) {
      return {
        sub: userId,
        email: 'dev@example.com',
      };
    }
    throw new Error('No claims found');
  }

  const supabase = await createSupabaseClient();
  if (!supabase) {
    // Если Supabase не настроен, возвращаем дефолтные claims
    return {
      sub: 'default-user-id',
      email: 'user@example.com',
    };
  }

  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    throw error;
  }
  if (!data?.claims) {
    throw new Error('No claims found');
  }
  return data.claims;
});


export const getCachedIsUserLoggedIn = cache(async () => {
  if (isDevAuthEnabled()) {
    return await hasDevSession();
  }

  const supabase = await createSupabaseClient();
  if (!supabase) {
    // Если Supabase не настроен, считаем что пользователь авторизован
    return true;
  }

  try {
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
      return false;
    }
    console.log('claims', data.claims);
    return data.claims.sub !== null;
  } catch (error) {
    // Если произошла ошибка, считаем что пользователь не авторизован
    return false;
  }
});

export const getCachedLoggedInUserId = cache(async () => {
  if (isDevAuthEnabled()) {
    const userId = await getDevUserId();
    return userId || 'dev-user-id';
  }

  try {
    const claims = await getCachedLoggedInUserClaims();
    return claims.sub;
  } catch (error) {
    // Если произошла ошибка, возвращаем дефолтный ID
    return 'default-user-id';
  }
});
