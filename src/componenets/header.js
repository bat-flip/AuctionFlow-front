// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './login';
import Icons from './icons';
import Logo from './logo';
import SearchBar from './searchbar';
import Modal from './modal';
import { useApp } from '../context/AppContext';
import './header.css';

function Header() {
  const AuthenticUrl = process.env.REACT_APP_AUTHENTIC_URL; // 로그인 여부 및 정보 URL
  const LogoutUrl = process.env.REACT_APP_LOGOUT_URL; // 로그아웃 처리 URL
  
  const [logoutMessage, setLogoutMessage] = useState(null); // 로그아웃 메시지
  const { userInfo, setUserInfo, isAuthenticated, setIsAuthenticated, setShowLoginModal } = useApp(); // Context에서 정보 가져오기
  const navigate = useNavigate();

  // 모달 열기
  const openModal = () => setShowLoginModal(true);
  // 모달 닫기
  const closeModal = () => setShowLoginModal(false);

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${AuthenticUrl}/userInfo`, { withCredentials: true }); // 쿠키 포함
      if (response.status === 200) {
        const data = response.data;
        setIsAuthenticated(true);
        setUserInfo(data); // Context에 사용자 정보 저장
      } else {
        handleUnauthenticated();
      }
    } catch (error) {
      console.error('Failed to fetch user info', error);
      handleUnauthenticated();
    }
  };

  const handleUnauthenticated = () => {
    setIsAuthenticated(false);
    setUserInfo(null); // Context에서 사용자 정보 제거
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await axios.post(LogoutUrl, {}, { withCredentials: true });
      console.log('Logout successful');
      handleUnauthenticated();
      setLogoutMessage('로그아웃 되었습니다!'); // 메시지 설정
      setTimeout(() => {
        setLogoutMessage(null); // 2초 후 메시지 숨기기
      }, 2000);
      navigate('/'); // 홈 페이지로 리다이렉트
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // 마이페이지 링크 클릭 핸들러
  const handleMyPageClick = () => {
    if (!isAuthenticated) {
      openModal(); // 로그인 모달 열기
    } else {
      navigate('/mypage'); // 로그인 상태라면 마이페이지로 이동
    }
  };

  return (
    <div className="header">
      <div className="top-content">
        {isAuthenticated ? (
          <div className="loginuser-container">
            <span className="loginuser">{userInfo ? `${userInfo.nickname}` : ''}님</span>
            <button onClick={handleLogout} className="logout-button">로그아웃</button>
          </div>
        ) : (
          <button onClick={openModal} className="login-button">로그인/회원가입</button>
        )}
        <button onClick={handleMyPageClick} className="mypage-link">마이페이지</button>
      </div>
      <div className="bottom-content">
        <div className="logo-content">
          <Logo />
        </div>
        <div className="search-content">
          <SearchBar />
        </div>
        <div className="icon-content">
          <Icons /> {/* Icons 컴포넌트에 로그인 모달 제어 함수 전달 */}
        </div>
      </div>

      <Modal isOpen={useApp().showLoginModal} onClose={closeModal}>
        <Login />
      </Modal>

      {/* 로그아웃 메시지 */}
      {logoutMessage && <div className="logout-message">{logoutMessage}</div>}
    </div>
  );
}

export default Header;
