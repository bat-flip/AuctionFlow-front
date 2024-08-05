import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from '../pages/login';
import Icons from './icons';
import Logo from './logo';
import SearchBar from './searchbar';
import Modal from './modal';
import './header.css';

function Header() {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="header">
      <div className="top-content">
        <div className="top-buttons">
          <button onClick={openModal}>로그인/회원가입</button>
          <Link to="/mypage">마이페이지</Link>
        </div>
      </div>

      <div className="bottom-content">
        <div className="logo-content">
          <Logo />
        </div>
        <div className="search-content">
          <SearchBar />
        </div>
        <div className="icon-content">
          <Icons /> {/* Icons 컴포넌트가 작은 아이콘을 렌더링한다고 가정 */}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Login />
      </Modal>
    </div>
  );
}

export default Header;
