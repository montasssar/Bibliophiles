// src/pages/LandingPage.js
import React from 'react';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      <h2>Welcome to Bibliophiles</h2>
      <p>This is the Landing Page</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '100px 20px',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
};

export default LandingPage;
