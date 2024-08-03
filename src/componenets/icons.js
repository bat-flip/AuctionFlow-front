import React from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { GoHeart } from "react-icons/go";
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 가져오기
import './icons.css'; // 아이콘 스타일을 위한 CSS 파일

function Icons() {
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const handleClick = () => {
    navigate('/post'); // '/post' 경로로 이동
  };

  return (
    <div className="icons">
      <div className="icon">
        <IoNotificationsOutline />
      </div>
      <div className="icon">
        <IoChatboxEllipsesOutline />
      </div>
      <div className="icon">
        <GoHeart /> 
      </div>
      <div className="icon">
        <div className="post-btn" onClick={handleClick}>등록하기</div>
      </div>
    </div>
  );
}

export default Icons;
