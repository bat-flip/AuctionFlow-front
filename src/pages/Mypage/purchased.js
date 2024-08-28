import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './purchased.css';

function PurchasedPage() {
  const [filter, setFilter] = useState('전체');
  const [purchasedData, setPurchasedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'http://localhost:8080/mypage/mylist';
        if (filter === '진행중') {
          url = 'http://localhost:8080/mypage/mylist?statusType=1';
        } else if (filter === '구매완료') {
          url = 'http://localhost:8080/mypage/mylist?statusType=2';
        }

        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const data = await response.json();
        setPurchasedData(data);
      } catch (error) {
        console.error('구매 데이터 가져오기 오류:', error);
      }
    };

    fetchData();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="purchased">
      <div className="purchased-header">구매 내역</div>
      {/* 필터 탭 */}
      <div className="filter-tabs">
        <button
          onClick={() => handleFilterChange('전체')}
          className={`tab ${filter === '전체' ? 'active' : ''}`}
        >
          전체 목록
        </button>
        <button
          onClick={() => handleFilterChange('진행중')}
          className={`tab ${filter === '진행중' ? 'active' : ''}`}
        >
          진행 중
        </button>
        <button
          onClick={() => handleFilterChange('구매완료')}
          className={`tab ${filter === '구매완료' ? 'active' : ''}`}
        >
          구매 완료
        </button>
      </div>
      {purchasedData.length === 0 ? (
        <div className="purchased-empty-message">구매 내역이 존재하지 않습니다.</div>
      ) : (
        <div className="purchased-grid">
          {purchasedData.map((product) => (
            <Link
              key={product.itemId}
              to={`/products/${product.itemId}`}
              className="purchased-card"
            >
              <img
                src={product.productImageUrls[0] || 'https://via.placeholder.com/150'}
                alt={product.title}
                className="purchased-image"
              />
              <div className="purchased-title">{product.title}</div>
              <div className="purchased-price">{product.startingBid.toLocaleString()}원</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default PurchasedPage;
