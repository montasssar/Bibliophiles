// src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import bookshelfImg from '../assets/bookshelf.jpg'; // adjust the path if different

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Image just below Navbar */}
      <img src={bookshelfImg} alt="Bookshelf" style={styles.image} />

      {/* Icons */}
      <div style={styles.icons}>
        <span role="img" aria-label="book" style={styles.icon}>📖</span>
        <span role="img" aria-label="user" style={styles.icon}>👤</span>
        <span role="img" aria-label="pen" style={styles.icon}>🖋️</span>
      </div>

      {/* Message */}
      <h1 style={styles.heading}>
        SIGN UP TO READ.. ALL WHAT’S ON YOUR MIND
      </h1>

      {/* Sign Up Button */}
      <button style={styles.button} onClick={() => navigate('/signup')}>
        Sign Up
      </button>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          Designed & Developed by{' '}
          <a href="https://github.com/mnt669" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Montassar B'neji
          </a>
        </p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    background: '#fffaf9',
    minHeight: '100vh',
    paddingBottom: '80px',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    maxHeight: '400px',
  },
  icons: {
    marginTop: '40px',
    fontSize: '40px',
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
  },
  icon: {
    fontSize: '48px',
  },
  heading: {
    fontSize: '26px',
    maxWidth: '700px',
    margin: '30px auto 20px',
    color: '#B03A2E',
    fontWeight: 'bold',
    padding: '0 20px',
    lineHeight: 1.4,
  },
  button: {
    backgroundColor: '#C0392B',
    color: '#fff',
    fontSize: '18px',
    padding: '14px 30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  footer: {
    marginTop: '60px',
    fontSize: '14px',
    color: '#888',
  },
  link: {
    color: '#C0392B',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default LandingPage;
