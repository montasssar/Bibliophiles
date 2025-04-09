// components/SearchBar.js
import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import './SearchBar.css';

const SearchBar = ({ query, setQuery, setIsFocused, onSearch }) => {
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsFocused(true);

    // Debounce to reduce rapid calls
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      if (onSearch) onSearch(newQuery);
    }, 400); // 400ms delay
    setDebounceTimeout(timeout);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    if (onSearch) onSearch('');
    setIsFocused(true);
  };

  return (
    <div className="search-bar-container" onClick={() => setIsFocused(true)}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Looking for a Book, type Here"
        className="search-input"
      />
      {query && <IoMdClose className="clear-icon" onClick={handleClear} />}
      <FiSearch className="search-icon" />
    </div>
  );
};

export default SearchBar;
