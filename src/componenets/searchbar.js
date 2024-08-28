// src/components/searchbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './searchbar.css';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // 검색 결과 페이지로 이동
      navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
      // 검색 후 입력 필드 비우기
      setSearchTerm('');
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder="상품명, 브랜드, 태그 등"
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">검색</button>
      </div>
    </div>
  );
}

export default SearchBar;
