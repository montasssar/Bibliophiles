
// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <nav style={styles.navbar}>
      <div style={styles.left} onClick={() => navigate('/')}>
        <h1 style={styles.title}>Bibliophiles</h1>
        <p style={styles.subtitle}>Thoughts & Pen</p>
      </div>

      <div style={styles.center}>
        <Link to="/home" style={styles.link}>Home</Link>
        <Link to="/library" style={styles.link}>Library</Link>
      </div>

      <div>
        {currentUser ? (
          <div style={styles.accountMenu}>
            <span>👤</span>
            <div style={styles.dropdown}>
              <button onClick={() => navigate('/account')}>Visit Account</button>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        ) : (
          <Link to="/signin">
            <button style={styles.loginBtn}>Log In</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px 30px',
    backgroundColor: '#B03A2E',
    color: '#fff'
  },
  left: {
    cursor: 'pointer',
    lineHeight: 1,
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    fontStyle: 'italic',
  },
  center: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#E74C3C',
    border: 'none',
    padding: '8px 15px',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  accountMenu: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    background: '#fff',
    color: '#000',
    borderRadius: '5px',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  }
};

export default Navbar;
