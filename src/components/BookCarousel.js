import React, { useEffect, useState } from 'react';
import './BookCarousel.css';
import { FaHeart, FaRegHeart, FaBook, FaFeatherAlt, FaLandmark, FaFlask, FaMask, FaTheaterMasks, FaBrain } from 'react-icons/fa';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const categories = [
  { value: 'classics', label: 'Classics', icon: <FaBook /> },
  { value: 'fiction', label: 'Fiction', icon: <FaFeatherAlt /> },
  { value: 'history', label: 'History', icon: <FaLandmark /> },
  { value: 'poetry', label: 'Poetry', icon: <FaHeart /> },
  { value: 'romance', label: 'Romance', icon: <FaTheaterMasks /> },
  { value: 'philosophy', label: 'Philosophy', icon: <FaBrain /> },
  { value: 'science', label: 'Science', icon: <FaFlask /> },
  { value: 'mystery', label: 'Mystery', icon: <FaMask /> }
];

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savedBookIds, setSavedBookIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('classics');

  const { currentUser } = useAuth();

  useEffect(() => {
    const randomStart = Math.floor(Math.random() * 100);
    setStartIndex(randomStart);
  }, [selectedCategory]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${selectedCategory}+arabic+english&startIndex=${startIndex}&maxResults=10`
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
  }, [startIndex, selectedCategory]);

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

  const handleCategoryChange = (value) => {
    setBooks([]);
    setStartIndex(0);
    setSelectedCategory(value);
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

      {/* Category Buttons + Load More */}
      <div className="category-dropdown-wrapper">
        <div className="category-dropdown">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`category-btn ${selectedCategory === cat.value ? 'selected' : ''}`}
            >
              {cat.icon} <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </>
  );
};

export default BookCarousel;
