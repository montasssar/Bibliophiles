import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/home');
    });
    return () => unsub();
  }, [navigate]);
};

export default useRedirectIfAuthenticated;
