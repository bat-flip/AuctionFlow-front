import React, { useState } from 'react';
import './sales.css';

function SalesPage() {
  const [filter, setFilter] = useState('전체');

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="sales">
      <div className="sales-header">판매 내역</div>
      <div className="filter-buttons">
        <button onClick={() => handleFilterChange('전체')} className={filter === '전체' ? 'active' : ''}>전체 목록</button>
        <button onClick={() => handleFilterChange('진행중')} className={filter === '진행중' ? 'active' : ''}>진행 중</button>
        <button onClick={() => handleFilterChange('구매완료')} className={filter === '구매완료' ? 'active' : ''}>판매 완료</button>
      </div>
      <div className="purchased-content">
        {filter === '전체' && <div>전체 판매 내역</div>}
        {filter === '진행중' && <div>진행 중인 판매 내역</div>}
        {filter === '구매완료' && <div>판매 완료된 내역</div>}
      </div>
    </div>
  );
}

export default SalesPage;
