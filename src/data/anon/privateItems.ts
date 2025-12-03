'use server';
import { createSupabaseClient } from '@/supabase-clients/server';
import { isDevAuthEnabled } from '@/utils/dev-auth';
import { Table } from '@/types';

export const getUserPrivateItems = async (): Promise<
  Array<Table<'private_items'>>
> => {
  const supabase = await createSupabaseClient();
  
  // В dev режиме без Supabase возвращаем пустой массив
  if (!supabase || isDevAuthEnabled()) {
    return [];
  }

  const { data, error } = await supabase.from('private_items').select('*');

  if (error) {
    throw error;
  }

  return data;
};

export const getPrivateItem = async (
  id: string
): Promise<Table<'private_items'>> => {
  const supabase = await createSupabaseClient();
  
  // В dev режиме без Supabase выбрасываем ошибку "не найдено"
  if (!supabase || isDevAuthEnabled()) {
    throw new Error('Item not found');
  }

  const { data, error } = await supabase
    .from('private_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
