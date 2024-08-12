import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <AppContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
