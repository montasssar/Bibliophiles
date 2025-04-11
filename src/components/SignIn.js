import React from 'react';
import '../styles/SignIn.css';
import useSignIn from '../hooks/useSignIn';
import useRedirectIfAuthenticated from '../hooks/useRedirectIfAuthenticated';

const SignIn = () => {
  const {
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit
  } = useSignIn();

  useRedirectIfAuthenticated(); // 👈 This line handles auto-redirect if user is already signed in

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default SignIn;
