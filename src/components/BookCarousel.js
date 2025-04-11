import React from 'react';
import '../styles/BookCarousel.css';
import { FaHeart, FaRegHeart, FaBook, FaFeatherAlt, FaLandmark, FaFlask, FaMask, FaTheaterMasks, FaBrain } from 'react-icons/fa';
import useBooks from '../hooks/useBooks';
import useSavedBooks from '../hooks/useSavedBooks';
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
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState('classics');

  const { books, loading, loadMore, setBooks } = useBooks(selectedCategory);
  const { savedBookIds, isBookSaved, toggleSaveBook } = useSavedBooks(currentUser);

  const handleCategoryChange = (value) => {
    setBooks([]);
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
                  <a href={previewLink} target="_blank" rel="noopener noreferrer">
                    <button className="read-now-btn">Read Now</button>
                  </a>
                ) : (
                  <button className="read-now-btn disabled" disabled>Not Available</button>
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

        <button onClick={loadMore} disabled={loading} className="load-more-btn">
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </>
  );
};

export default BookCarousel;
