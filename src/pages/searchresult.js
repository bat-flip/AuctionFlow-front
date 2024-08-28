import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './searchresult.css'; // 스타일을 별도의 CSS 파일로 분리

function SearchResultsPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = query.get('keyword') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/items/search?keyword=${keyword}`);
        if (Array.isArray(response.data)) {
          setSearchResults(response.data);
          setError('');
        } else {
          setSearchResults([]);
          setError('검색 결과가 없습니다.');
        }
      } catch (error) {
        setError('검색 중 오류가 발생했습니다.');
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  function highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  return (
    <div className="search-container">
      <p className="search-header" dangerouslySetInnerHTML={{ __html: highlightKeyword(`"${keyword}" 의 검색 결과`, keyword) }} />
      {error && <p className="search-error">{error}</p>}
      {searchResults.length > 0 ? (
        <div className="search-grid">
          {searchResults.map((item) => (
            <Link
              key={item.itemId}
              to={`/products/${item.itemId}`} // 클릭 시 이동할 경로 설정
              className="search-card">
              <img
                src={item.productImageUrls && item.productImageUrls.length > 0 ? item.productImageUrls[0] : 'https://via.placeholder.com/150'}
                alt={item.title}
                className="search-image"
              />
                <div className="search-title">{item.title}</div>
                <div className="search-price">
                  {item.startingBid !== undefined && item.startingBid !== null ? item.startingBid.toLocaleString() + '원' : '가격 정보 없음'}
                </div>
            </Link>
          ))}
        </div>
      ) : (
        !error && <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;
