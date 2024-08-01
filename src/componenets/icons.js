import React from 'react';
import './icons.css'; // 아이콘 스타일을 위한 CSS 파일

function Icons() {
  return (
    <div className="icons">
      <div className="icon">
        <img src="/path/to/icon1.svg" alt="아이콘 1" />
      </div>
      <div className="icon">
        <img src="/path/to/icon2.svg" alt="아이콘 2" />
      </div>
      <div className="icon">
        <img src="/path/to/icon3.svg" alt="아이콘 3" />
      </div>
    </div>
  );
}

export default Icons;
