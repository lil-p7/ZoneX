import { createContext, useContext, useEffect, useState } from 'react';
import { ID, Models } from 'react-native-appwrite';
import { account } from './appwrite'; // Adjust if your import path differs

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  signUp: (email: string, password: string, name: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    getUser(); // On mount
  }, []);

  const getUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error: any) {
      // Handles the "User(role: guests) missing scope (account)" error
      if (error?.message?.includes('missing scope') || error?.type === 'general_unauthorized_scope') {
        setUser(null);
      } else {
        console.error('Unexpected error in getUser():', error);
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await account.create(ID.unique(), email, password, name);
      await signIn(email, password); // Auto login after signup
      return null;
    } catch (error) {
      if (error instanceof Error) return error.message;
      return 'An error occurred during sign up';
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Optional: Clear any existing session first
      try {
        await account.deleteSession('current');
      } catch (e) {
        // It's okay if there's no session yet
        console.log('No existing session to clear:', e instanceof Error ? e.message : 'Unknown error');
      }
  
      // Now create a new session
      await account.createEmailPasswordSession(email, password);
      const session = await account.get();
      setUser(session);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An error occurred during sign in";
    }
  };
  
  const signOut = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoadingUser, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
