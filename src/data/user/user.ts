
'use server'

import { createSupabaseClient } from "@/supabase-clients/server";
import { getDevUserId, isDevAuthEnabled } from "@/utils/dev-auth";

export async function getLoggedInUserId() {
  // Dev режим: возвращаем dev user ID если есть сессия
  if (isDevAuthEnabled()) {
    const devUserId = await getDevUserId();
    if (devUserId) {
      return devUserId;
    }
  }

  const supabase = await createSupabaseClient();
  if (!supabase) {
    throw new Error('User not logged in');
  }

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    throw new Error('User not logged in');
  }
  if (!data?.claims?.sub) {
    throw new Error('User not logged in');
  }
  return data.claims.sub;
}
