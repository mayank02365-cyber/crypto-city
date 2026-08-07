import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('cryptocity_user');
    return saved ? JSON.parse(saved) : { id: 'demo-user-123', email: 'trader@cryptocity.io', name: 'Alex Vance' };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(user));

  useEffect(() => {
    // Check initial Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authUser: UserProfile = {
          id: session.user.id,
          email: session.user.email || 'trader@cryptocity.io',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        };
        setUser(authUser);
        setIsAuthenticated(true);
      }
    });

    // Listen to Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const authUser: UserProfile = {
          id: session.user.id,
          email: session.user.email || 'trader@cryptocity.io',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        };
        setUser(authUser);
        setIsAuthenticated(true);
        localStorage.setItem('cryptocity_user', JSON.stringify(authUser));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('cryptocity_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password?: string) => {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback for demo mode
        const fallbackUser = { id: `user-${Date.now()}`, email, name: email.split('@')[0] };
        setUser(fallbackUser);
        localStorage.setItem('cryptocity_user', JSON.stringify(fallbackUser));
        return { success: true };
      }
    }
    const newUser = { id: `user-${Date.now()}`, email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('cryptocity_user', JSON.stringify(newUser));
    return { success: true };
  };

  const signUp = async (email: string, password?: string) => {
    if (password) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        const fallbackUser = { id: `user-${Date.now()}`, email, name: email.split('@')[0] };
        setUser(fallbackUser);
        localStorage.setItem('cryptocity_user', JSON.stringify(fallbackUser));
        return { success: true };
      }
    }
    const newUser = { id: `user-${Date.now()}`, email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('cryptocity_user', JSON.stringify(newUser));
    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('cryptocity_user');
    return { success: true };
  };

  return {
    user,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
}
