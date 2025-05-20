
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

export const useSignOut = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { handleSignOut };
};
