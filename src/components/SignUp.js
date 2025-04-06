import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /><br /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br /><br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
