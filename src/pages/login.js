import React, { useEffect } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const REST_API = '1358698c1181767dbdad5cdb6d49b935'; // 카카오 ClientID
  const REDIRECT_URI = 'http://localhost:3000/login/oauth2/code'; // Redirect Uri
  const BACKEND_URI = 'http://localhost:8080/oauth2/authorization/kakao';

  const navigate = useNavigate();
  const handleLogin = () => {
    console.log('Login button clicked');  // 카카오 버튼 클릭시
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;

    window.location.href = kakaoAuthUrl; // 카카오 로그인 페이지로 리다이렉트
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode) {
      console.log('Authorization code:', authCode);  // 인가코드 로그 추가

      axios.post(BACKEND_URI, { code: authCode })
        .then(response => {
          console.log('Server response:', response.data);  // 로그 추가
          const { name } = response.data;  // 백엔드 응답에서 사용자 이름을 추출
          if (name) {
            localStorage.setItem('username', name);  // 로컬 스토리지에 사용자 이름 저장
          }
          navigate('/');  // 로그인 후 홈 페이지로 네비게이션
        })
        .catch(error => {
          console.error('Error sending authorization code to backend:', error);  // 에러 로그 추가
        });
    }
  }, [navigate]);

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
