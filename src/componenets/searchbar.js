import React from 'react';
import './searchbar.css';

function SearchBar() {
  return (
    <input type="text" placeholder="상품명, 브랜드, 태그 등" className="search-bar" />
  );
}

export default SearchBar;
