import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './mypage.css';

function MyPage() {
  return (
    <div className="mypage">
      <nav className="sidebar">
        <div className="sidebar-title">마이페이지</div>
        <NavLink to="/mypage" className="sidebar-con" end>내 정보 / 상점 관리</NavLink>
        <NavLink to="/mypage/purchased" className="sidebar-con">구매 내역</NavLink>
        <NavLink to="/mypage/sales" className="sidebar-con">판매 내역</NavLink>
        <NavLink to="/mypage/fav" className="sidebar-con">관심</NavLink>
        <NavLink to="/mypage/talk" className="sidebar-con">채팅</NavLink>
      </nav>
      <div className="content">
        <Outlet /> {/* 자식페이지 */}
      </div>
    </div>
  );
}

export default MyPage;
