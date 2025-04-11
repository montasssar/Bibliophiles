import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css'; // 👈 linked external stylesheet

const Navbar = () => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/signin');
    } catch (error) {
      alert("Logout failed.");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate('/')}>
        <h1 className="nav-title">Bibliophiles</h1>
        <p className="nav-subtitle">Thoughts & Pen</p>
      </div>

      <div className="nav-center">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/library" className="nav-link">Library</Link>
      </div>

      <div className="nav-right">
        {currentUser ? (
          <div className="account-menu">
            <span>👤</span>
            <div className="dropdown">
              <button onClick={() => navigate('/account')}>Visit Account</button>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        ) : (
          <Link to="/signin">
            <button className="login-btn">Log In</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

