import React from 'react';
import { Link } from 'react-router-dom';
import './logo.css';

function Logo() {
  return (
    <Link to="/" className="logo">
        <span className="logo-large">A</span>
        <span className="logo-small">uction</span>
        <span className="logo-large">FLOW.</span>
    </Link>
  );
}

export default Logo;
