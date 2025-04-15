import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import '../styles/ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
    >
      <svg className="glow-svg" viewBox="0 0 100 100">
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffdab9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffdab9" stopOpacity="0" />
        </radialGradient>
        <circle cx="50" cy="50" r="40" fill="url(#glow)" />
      </svg>
      <FaArrowUp className="arrow-icon" />
    </div>
  );
};

export default ScrollToTop;
