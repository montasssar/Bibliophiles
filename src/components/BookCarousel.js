import React, { useEffect, useState } from 'react';
import './BookCarousel.css';

const BookCarousel = () => {
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Generate a random starting index (between 0 and 100 for example)
  useEffect(() => {
    const randomStart = Math.floor(Math.random() * 100); // Adjust range as needed
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
