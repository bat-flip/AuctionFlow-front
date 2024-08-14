import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './mypage.css';

function MyPage() {
  return (
    <div className="mypage">
      <nav className="sidebar">
        <div className="sidebar-title">마이페이지</div>
        <NavLink to="/mypage" className="sidebar-header" end>내 정보 / 상점 관리</NavLink>
        <NavLink to="/mypage/purchased" className="sidebar-header">구매 내역</NavLink>
        <NavLink to="/mypage/sales" className="sidebar-header">판매 내역</NavLink>
        <NavLink to="/mypage/fav" className="sidebar-header">관심</NavLink>
        <NavLink to="/mypage/talk" className="sidebar-header">채팅</NavLink>
      </nav>
      <div className="content">
        <Outlet /> {/* 자식페이지 */}
      </div>
    </div>
  );
}

export default MyPage;
