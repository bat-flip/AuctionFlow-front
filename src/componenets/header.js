import React, { useState } from 'react';
import Logo from './logo';
import SearchBar from './searchbar';
import { Link } from 'react-router-dom';
import Modal from './modal';
import Login from '../pages/login';
import './header.css';

function Header() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
