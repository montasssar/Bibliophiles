import React, { useEffect, useState } from 'react';
import './BookCarousel.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savedBookIds, setSavedBookIds] = useState([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    const randomStart = Math.floor(Math.random() * 100);
    setStartIndex(randomStart);
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=classics+arabic+english&startIndex=${startIndex}&maxResults=10`
      );
      const data = await response.json();
      setBooks((prevBooks) => [...prevBooks, ...(data.items || [])]);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startIndex >= 0) {
      fetchBooks();
    }
  }, [startIndex]);

  const fetchSavedBooks = async () => {
    if (!currentUser) return;
    const ref = collection(db, 'users', currentUser.uid, 'savedBooks');
    const snapshot = await getDocs(ref);
    const ids = snapshot.docs.map(doc => doc.id);
    setSavedBookIds(ids);
  };

  useEffect(() => {
    fetchSavedBooks();
  }, [currentUser]);

  const isBookSaved = (bookId) => savedBookIds.includes(bookId);

  const toggleSaveBook = async (book) => {
    if (!currentUser) return alert('Please sign in to save books.');

    const bookRef = doc(db, 'users', currentUser.uid, 'savedBooks', book.id);

    if (isBookSaved(book.id)) {
      await deleteDoc(bookRef);
      setSavedBookIds((prev) => prev.filter((id) => id !== book.id));
    } else {
      await setDoc(bookRef, {
        id: book.id,
        title: book.volumeInfo.title,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        previewLink: book.volumeInfo.previewLink,
      });
      setSavedBookIds((prev) => [...prev, book.id]);
    }
  };

  const handleLoadMore = () => {
    setStartIndex((prev) => prev + 10);
  };

  return (
    <>
      <div className="carousel-container">
        <div className="carousel-track">
          {books.map((book) => {
            const info = book.volumeInfo;
            const access = book.accessInfo;
            const thumbnail = info.imageLinks?.thumbnail || '';
            const title = info.title;
            const hasPreview = access.viewability !== 'NO_PAGES';
            const previewLink = info.previewLink;

            return (
              <div className="carousel-card" key={book.id}>
                <img src={thumbnail} alt={title} />
                <p title={title}>{title}</p>

                {hasPreview ? (
                  <a
                    href={previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="read-now-btn">Read Now</button>
                  </a>
                ) : (
                  <button className="read-now-btn disabled" disabled>
                    Not Available
                  </button>
                )}

                <button className="save-icon" onClick={() => toggleSaveBook(book)}>
                  {isBookSaved(book.id)
                    ? <FaHeart color="red" />
                    : <FaRegHeart color="white" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Load More Button */}
      <div className="load-more-wrapper">
        <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </>
  );
};

export default BookCarousel;
