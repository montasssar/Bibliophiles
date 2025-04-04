
// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

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

      <div style={styles.right}>
        <button style={styles.loginBtn}>Log In</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#B03A2E',
    color: '#fff',
    padding: '15px 30px',
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
    gap: '25px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
  },
  right: {},
  loginBtn: {
    backgroundColor: '#E74C3C',
    border: 'none',
    color: '#fff',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Navbar;
