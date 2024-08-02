import React from 'react';
import './login.css';

function Login() {
  const clientId = '1358698c1181767dbdad5cdb6d49b935'; // 카카오 클라이언트 ID로 변경하세요
  const redirectUri = 'http://localhost:3000/login/oauth2/code'; // 설정한 리다이렉트 URI로 변경하세요

  const handleLogin = () => {
    console.log('Login button clicked');  // 로그 추가
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

    const popupWidth = 600;
    const popupHeight = 750;
    const left = (window.innerWidth / 2) - (popupWidth / 2);
    const top = (window.innerHeight / 2) - (popupHeight / 2);

    const popup = window.open(
      kakaoAuthUrl,
      'kakaoLoginPopup',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes`
    );

    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          console.log('Popup closed');  // 로그 추가
          // 팝업이 닫혔을 때 필요한 작업을 여기에 추가하세요
          // 예: 사용자 인증 상태 확인 등
        }
      }, 1000);
    } else {
      console.log('Popup blocked');  // 로그 추가
    }
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
