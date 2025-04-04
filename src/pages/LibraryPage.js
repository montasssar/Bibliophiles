// src/pages/LibraryPage.js
import React from 'react';

const LibraryPage = () => {
  return (
    <div style={styles.container}>
      <h2>Your Library</h2>
      <p>This page will show your saved books and quotes.</p>
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

export default LibraryPage;
