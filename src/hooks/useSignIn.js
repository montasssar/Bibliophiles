import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit
  };
};

export default useSignIn;
