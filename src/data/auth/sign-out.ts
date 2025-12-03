'use server';

import { createSupabaseClient } from '@/supabase-clients/server';
import { deleteDevSession, isDevAuthEnabled } from '@/utils/dev-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signOutAction() {
    // Dev режим: удаляем dev сессию
    if (isDevAuthEnabled()) {
        await deleteDevSession();
        revalidatePath('/', 'layout');
        redirect('/login');
        return;
    }

    const supabase = await createSupabaseClient();
    if (!supabase) {
        revalidatePath('/', 'layout');
        redirect('/login');
        return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
    redirect('/login');
}
