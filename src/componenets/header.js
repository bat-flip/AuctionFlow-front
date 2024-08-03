import React, { useState, useEffect } from 'react';
import Login from '../pages/login';
import Icons from './icons';
import Logo from './logo';
import SearchBar from './searchbar';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './modal';
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
      console.log('Authorization code:', authCode);

      axios.post(BACKEND_URI, { code: authCode })
        .then(response => {
          console.log('Server response:', response.data);
          const { name } = response.data;
          if (name) {
            localStorage.setItem('username', name);
          }
          navigate('/');
        })
        .catch(error => {
          console.error('Error sending authorization code to backend:', error);
        });
    }
  }, [navigate]);

  return (
    <div className="header">
      <div className="top-content">
        <div className="top-buttons">
          <button onClick={openModal}>로그인/회원가입</button>
          <Link to="/mypage">마이페이지</Link>
        </div>
      </div>

      <div className="bottom-content">
        <Logo />
        <div className="searchbar-container">
          <SearchBar />
          <div className="search-icon">
            <Icons /> {/* Assuming Icons component can be used to render a small icon */}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Login />
      </Modal>
    </div>
  );
}

export default Header;
