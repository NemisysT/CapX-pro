'use server';

import { supabase } from '@/utils/supabaseClient';

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw new Error(authError.message);

  if (authData.user) {
    const { error: dbError } = await supabase
      .from('profiles')
      .insert([{ id: authData.user.id, full_name: fullName }]);

    if (dbError) throw new Error(dbError.message);
  }
};
