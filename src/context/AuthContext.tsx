import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

export interface Profile {
  id: string;
  created_at: string;
  role: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires once on initialization, and then for every auth event.
    // This is the single source of truth for the user's auth state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // If there's a user, fetch their profile.
          const { data: userProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          // We only want to log an error if it's not the expected "no rows found" error.
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            setProfile(null);
          } else {
            setProfile(userProfile ?? null);
          }
        } else {
          // If there's no session, clear the profile.
          setProfile(null);
        }
      } catch (error) {
        // Catch any unexpected errors during the process.
        console.error('Error in onAuthStateChange handler:', error);
        setProfile(null);
      } finally {
        // This block is GUARANTEED to run, ensuring we never get stuck in a loading state.
        setLoading(false);
      }
    });

    // Cleanup the subscription when the component unmounts.
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}