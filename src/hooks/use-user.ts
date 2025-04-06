import { useAuth } from '@/hooks/use-auth';

// This hook is a wrapper around useAuth to provide user-related functionality
export const useUser = () => {
  const { user, signIn, signOut, signUp } = useAuth();
  
  return {
    user,
    signIn,
    signOut,
    signUp,
    isAuthenticated: !!user
  };
}; 