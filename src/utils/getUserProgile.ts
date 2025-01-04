import { supabase } from './supabaseClient';

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name') // Fetch `display_name`.
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return data?.display_name;
};
