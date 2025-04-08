import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import '../components/BookCarousel.css'; // Correct style path

const LibraryPage = () => {
  const { currentUser } = useAuth();
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      if (!currentUser) return;

      const ref = collection(db, 'users', currentUser.uid, 'savedBooks');
      const snapshot = await getDocs(ref);
      const books = snapshot.docs.map(doc => doc.data());
      setSavedBooks(books);
      setLoading(false);
    };

    fetchSavedBooks();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="page-container">
        <h2>Please sign in to view your saved books.</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="section-title">📚 Your Saved Books</h2>

      {loading ? (
        <p>Loading saved books...</p>
      ) : savedBooks.length === 0 ? (
        <p>You haven't saved any books yet. Go save some!</p>
      ) : (
        <div className="carousel-track">
          {savedBooks.map((book) => (
            <div className="carousel-card" key={book.id}>
              <img src={book.image} alt={book.title} />
              <p title={book.title}>{book.title}</p>

              <a href={book.previewLink} target="_blank" rel="noopener noreferrer">
                <button className="read-now-btn">Read Now</button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
