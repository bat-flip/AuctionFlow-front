import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './sales.css';

function SalesPage() {
  const [filter, setFilter] = useState('전체');
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = 'http://localhost:8080/mypage/sell'; // 기본값: 전체
        if (filter === '진행중') {
          url = 'http://localhost:8080/mypage/sell?statusType=2';
        } else if (filter === '판매완료') {
          url = 'http://localhost:8080/mypage/sell?statusType=3';
        }

        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',  // 쿠키를 포함하여 요청을 보냅니다
        });

        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }

        const data = await response.json();
        setSalesData(data);
      } catch (error) {
        console.error('판매 데이터 가져오기 오류:', error);
      }
    };

    fetchData();
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="sales">
      <div className="sales-header">판매 내역</div>
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('전체')} className={filter === '전체' ? 'active' : ''}>전체 목록</button>
        <button onClick={() => handleFilterChange('진행중')} className={filter === '진행중' ? 'active' : ''}>진행 중</button>
        <button onClick={() => handleFilterChange('판매완료')} className={filter === '판매완료' ? 'active' : ''}>판매 완료</button>
      </div>
      <div className="sales-grid">
        {salesData.length > 0 ? (
          salesData.map((product) => (
            <Link 
              key={product.itemId} 
              to={`/products/${product.itemId}`} // 클릭 시 이동할 경로 설정
              className="sales-card"
            >
              <img 
                src={product.productImageUrls[0] || 'https://via.placeholder.com/150'} 
                alt={product.title} 
                className="sales-image" 
              />
              <div className="sales-title">{product.title}</div>
              <div className="sales-price">{product.startingBid.toLocaleString()}원</div>
            </Link>
          ))
        ) : (
          <div>판매 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default SalesPage;
