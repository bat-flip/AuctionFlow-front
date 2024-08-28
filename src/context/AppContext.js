// src/context/AppContext.js
import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const [storeData, setStoreData] = useState({
    name: '',
    content: ''
  }); // 상점 정보
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 상태
  const [showLoginModal, setShowLoginModal] = useState(false); // 로그인 모달 상태

  return (
    <AppContext.Provider 
      value={{ 
        userInfo, 
        setUserInfo, 
        storeData, 
        setStoreData, 
        isAuthenticated, 
        setIsAuthenticated, 
        showLoginModal, 
        setShowLoginModal 
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
