import { useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const { user, isAdmin, isLoading, setUser, setIsAdmin, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        setIsAdmin(!u.isAnonymous);
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Auth Error:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsAdmin, setLoading]);

  const loginAsAdmin = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
    await signInAnonymously(auth);
  };

  return { user, isAdmin, isLoading, loginAsAdmin, logout };
};
