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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Set core auth state synchronously
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Stop loading screen immediately
      setLoading(false);

      // Fetch profile details separately, without blocking the UI
      if (currentUser) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
          .then(({ data: userProfile, error }) => {
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
              setProfile(null);
            } else {
              setProfile(userProfile ?? null);
            }
          });
      } else {
        // Clear profile if user is logged out
        setProfile(null);
      }
    });

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-warmBeige">
        <p className="text-charcoal font-serif text-lg">Initializing...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}