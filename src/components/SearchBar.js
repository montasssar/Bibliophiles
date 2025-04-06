import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import './SearchBar.css';

const SearchBar = ({ query, setQuery, setIsFocused }) => {
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsFocused(true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
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
