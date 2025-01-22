import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { router } from 'expo-router';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  completedSignUp: boolean;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextType extends AuthState {
  signUp: (credentials: SignInCredentials) => Promise<{ user: User | null; session: Session | null }>;
  signIn: (credentials: SignInCredentials) => Promise<{ user: User | null; session: Session | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: { email?: string; password?: string; data?: object }) => Promise<{
    user: User;
  }>;
  setCompletedSignUp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    completedSignUp: false,
  });

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        const { data } = await supabase.from('users').select('username').eq('id', session?.user?.id);


        if (error) throw error;

        if (mounted) {
          // console.log('username:', data[0]?.username);
          // console.log('Completed sign up:', data[0]?.username == null ? false : true);

          if (session) {
            await handleTokenUpdate();
          }
          
          setState(prev => ({
            ...prev,
            session,
            user: session?.user ?? null,
            loading: false,
            completedSignUp: data[0]?.username == null ? false : true,
          }));
        }
      } catch (error) {
        console.error('Error getting initial session:', error instanceof Error ? error.message : String(error));
        setState(prev => ({ ...prev, loading: false }));
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));
    });

    

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleTokenUpdate = async () => {
    try {
      // Refresh the session to ensure tokens are up-to-date
      const { data, error } = await supabase.auth.refreshSession();
  
      if (error) {
        console.error("Error refreshing session:", error);
      } else {
        // console.log("Session refreshed:", data);
      }
    } catch (error) {
      console.error("Error updating token:", error);
    }
  };
  


  const signUp = async ({ email, password }: SignInCredentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      return { user: data.user, session: data.session };
    } catch (error) {
      throw error;
    }
  };

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.includes('invalid_credentials')) {
          throw new Error('Invalid email or password.');
        } else if (error.message.includes('user_not_found')) {
          throw new Error('No account found for this email.');
        } else {
          throw error; // For other errors, we throw the original error
        }
      }
      return { user: data.user, session: data.session };
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      router.replace('/')
      const { error } = await supabase.auth.signOut();
      setState(prev => ({ ...prev, completedSignUp: false }));
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'yourapp://reset-password',
      });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (updates: { email?: string; password?: string; data?: object }) => {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      return { user: data.user };
    } catch (error) {
      throw error;
    }
  };

  const setCompletedSignUp = () => {
    setState(prev => ({ ...prev, completedSignUp: true }));
  };
  

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
    setCompletedSignUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

