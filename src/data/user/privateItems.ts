'use server';
import { authActionClient } from '@/lib/safe-action';
import { createSupabaseClient } from '@/supabase-clients/server';
import { runEffectInAction } from '@/utils/effect-bridge';
import { insertPrivateItemEffect } from '@/utils/effect-supabase-queries';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const insertPrivateItemSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const insertPrivateItemAction = authActionClient
  .schema(insertPrivateItemSchema)
  .action(async ({ parsedInput, ctx }) => {
    const supabaseClient = await createSupabaseClient();

    // В dev режиме без Supabase возвращаем моковый ID
    if (!supabaseClient) {
      revalidatePath('/');
      return 'dev-item-id-' + Date.now();
    }

    // Use Effect utility with typed error handling
    // Explicitly set owner_id from authenticated user context
    const data = await runEffectInAction(
      insertPrivateItemEffect(supabaseClient, {
        ...parsedInput,
        owner_id: ctx.userId,
      })
    );

    revalidatePath('/');
    return data.id;
  });

const deletePrivateItemSchema = z.object({
  id: z.string().uuid(),
});

export const deletePrivateItemAction = authActionClient
  .schema(deletePrivateItemSchema)
  .action(async ({ parsedInput }) => {
    const supabaseClient = await createSupabaseClient();
    
    // В dev режиме без Supabase просто редиректим
    if (!supabaseClient) {
      revalidatePath('/');
      redirect('/private-items');
      return { success: true };
    }

    const { error } = await supabaseClient
      .from('private_items')
      .delete()
      .eq('id', parsedInput.id);

    if (error) {
      throw new Error(error.message);
    }
    revalidatePath('/');
    redirect('/private-items');
    return { success: true };
  });
