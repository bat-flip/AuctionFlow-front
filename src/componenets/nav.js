import React from 'react';
import { NavLink } from 'react-router-dom';
import './nav.css';

function Nav() {
  return (
    <nav className="nav-bar">
      <NavLink exact to="/" activeClassName="active-link">홈</NavLink>
      <NavLink to="/products" activeClassName="active-link">전체 목록</NavLink>
      <NavLink to="/timeout" activeClassName="active-link">종료 임박</NavLink>
      <NavLink to="/soldout" activeClassName="active-link">판매 완료</NavLink>
    </nav>
  );
}

export default Nav;
