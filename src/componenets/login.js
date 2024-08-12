import React from 'react';
import './login.css';

function Login() {
  const LoginURL = process.env.REACT_APP_LOGIN_URL;

  const handleLogin = () => {
    window.location.href = LoginURL; // 카카오 로그인 페이지로 리다이렉트
  };

  return (
    <div className="login-container">
      <h1 className="logo2">
        <span className="logo2-large">A</span>
        <span className="logo2-small">uction</span>
        <span className="logo2-large">FLOW.</span>
      </h1>
      <p className="login-message">간편하게 가입하고 상품을 확인해보세요.</p>
      
      <button 
        onClick={handleLogin} 
        className="kakao-login-btn"
      >
        <img src="/kakaologin.png" alt="카카오 로그인" />
      </button>
    </div>
  );
}

export default Login;
