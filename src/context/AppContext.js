import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const [storeData, setStoreData] = useState({
    name: '',
    content: ''
  }); // 상점 정보

  return (
    <AppContext.Provider value={{ userInfo, setUserInfo, storeData, setStoreData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
