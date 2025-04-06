import React from 'react';
import { useNavigate } from 'react-router-dom';
import bookshelfImg from '../assets/bookshelf.jpg';
import BookCarousel from '../components/BookCarousel';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Bookshelf with Carousel inside */}
      <div className="bookshelf-wrapper">
        <img src={bookshelfImg} alt="Bookshelf" className="bookshelf-image" />
        <div className="carousel-overlay">
          <BookCarousel />
        </div>
      </div>

      {/* Welcome Message */}
      <h2 className="landing-welcome">
        Welcome to <span className="landing-highlight">Bibliophiles</span>, Your warm Home of words
      </h2>

      {/* Sign Up Button */}
      <button className="landing-button" onClick={() => navigate('/signup')}>
        Sign Up
      </button>

      {/* Footer */}
      <footer className="landing-footer">
        <p>
          Designed & Developed by{' '}
          <a
            href="https://github.com/mnt669"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-link"
          >
            Montassar B'neji
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
