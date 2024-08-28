import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './purchased.css';

function PurchasedPage() {
  const [filter, setFilter] = useState('전체');
  const [purchasedData, setPurchasedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'http://localhost:8080/mypage/mylist'; // 기본값: 전체
        if (filter === '진행중') {
          url = 'http://localhost:8080/mypage/mylist?statusType=1';
        } else if (filter === '구매완료') {
          url = 'http://localhost:8080/mypage/mylist?statusType=2';
        }

        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',  // 쿠키를 포함하여 요청을 보냅니다
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
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('전체')} className={filter === '전체' ? 'active' : ''}>전체 목록</button>
        <button onClick={() => handleFilterChange('진행중')} className={filter === '진행중' ? 'active' : ''}>진행 중</button>
        <button onClick={() => handleFilterChange('구매완료')} className={filter === '구매완료' ? 'active' : ''}>구매 완료</button>
      </div>
      <div className="purchased-grid">
        {purchasedData.map((product) => (
          <Link 
            key={product.itemId} 
            to={`/products/${product.itemId}`} // 클릭 시 이동할 경로 설정
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
    </div>
  );
}

export default PurchasedPage;
