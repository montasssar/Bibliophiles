import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import '../styles/SearchBar.css';

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Looking for a Book, type here"
        className="search-input"
      />
      {value && <IoMdClose className="clear-icon" onClick={onClear} />}
      <FiSearch className="search-icon" />
    </div>
  );
};

export default SearchBar;
