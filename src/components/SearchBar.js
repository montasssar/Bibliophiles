import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import '../styles/SearchBar.css';
import useDebouncedSearch from '../hooks/useDebouncedSearch';

const SearchBar = ({ query, setQuery, setIsFocused, onSearch }) => {
  useDebouncedSearch(query, 400, onSearch);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsFocused(true);
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
