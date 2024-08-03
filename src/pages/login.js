import React from 'react';
import './login.css';

function Login() {
  const REST_API = '1358698c1181767dbdad5cdb6d49b935'; // 카카오 ClientID
  const REDIRECT_URI = 'http://localhost:3000/login/oauth2/code'; // Redirect Uri

  const handleLogin = () => {
    console.log('Login button clicked');  // 로그 추가
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;

    window.location.href = kakaoAuthUrl; // 카카오 로그인 페이지로 리다이렉트
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
        <img src="/kakaologin.png" alt="카카오로 로그인" />
      </button>
    </div>
  );
}

export default Login;
