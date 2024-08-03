import React, { useState, useEffect } from 'react';
import Logo from './logo';
import SearchBar from './searchbar';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './modal';
import Login from '../pages/login';
import './header.css';
import axios from 'axios';

function Header() {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URI = 'http://localhost:8080/oauth2/authorization/kakao';

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
      console.log('Authorization code:', authCode);  // 로그 추가

      axios.post(BACKEND_URI, { code: authCode })
        .then(response => {
          console.log('Server response:', response.data);  // 로그 추가
          const { name } = response.data;  // 백엔드 응답에서 사용자 이름을 추출
          if (name) {
            localStorage.setItem('username', name);  // 로컬 스토리지에 사용자 이름 저장
          }
          navigate('/');  // 로그인 후 홈 페이지로 네비게이션
        })
        .catch(error => {
          console.error('Error sending authorization code to backend:', error);  // 로그 추가
        });
    }
  }, [navigate]);

  return (
    <div className="header">
      <div className="top-content">
        <button onClick={openModal}>로그인/회원가입</button>
        <Link to="/mypage">마이페이지</Link>
      </div>

      <div className="bottom-content">
        <Logo />
        <div className="searchbar-container">
          <SearchBar />
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Login />
      </Modal>
    </div>
  );
}

export default Header;
