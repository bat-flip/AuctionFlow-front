import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
import './icons.css'; // 아이콘 스타일을 위한 CSS 파일

function Icons() {
  const [isNotificationHovered, setNotificationHovered] = useState(false); // 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const handleChatClick = () => {
    navigate('/mypage/talk'); // '/talk' 경로로 이동
  };

  const handleHeartClick = () => {
    navigate('/mypage/fav'); // '/favorites' 경로로 이동 (예시)
  };

  const handlePostButtonClick = () => {
    navigate('/post'); // '/post' 경로로 이동
  };

  const handleNotificationClick = (notification) => {
    // 알림 클릭 시 원하는 동작 수행
    console.log('Clicked notification:', notification);
    // 예를 들어, 알림 상세 페이지로 이동
    navigate(`/notifications/${notification.id}`);
  };

  return (
    <div className="icons">
      <div 
        className="icon notification-icon" 
        onMouseEnter={() => setNotificationHovered(true)} 
        onMouseLeave={() => setNotificationHovered(false)}
      >
        <span>알림</span>
        {isNotificationHovered && (
          <div className="notification-tooltip">
            <div className="tooltip-item" onClick={() => handleNotificationClick({ id: 1, text: '새로운 알림 1' })}>새로운 알림 1</div>
            <div className="tooltip-item" onClick={() => handleNotificationClick({ id: 2, text: '새로운 알림 2' })}>새로운 알림 2</div>
            <div className="tooltip-item" onClick={() => handleNotificationClick({ id: 3, text: '새로운 알림 3' })}>새로운 알림 3</div>
            {/* 필요에 따라 더 많은 항목 추가 */}
          </div>
        )}
      </div>
      <div className="icon" onClick={handleChatClick}>
        <span>채팅</span>
      </div>
      <div className="icon" onClick={handleHeartClick}>
        <span>관심</span>
      </div>
      <div className="icon">
        <div className="post-btn" onClick={handlePostButtonClick}>등록</div>
      </div>
    </div>
  );
}

export default Icons;
