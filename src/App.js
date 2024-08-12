import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './componenets/header';
import NavBar from './componenets/nav';
import MainPage from './pages/main';
import MyPage from './pages/mypage';
import SettingPage from './pages/Mypage/setting';
import PurchasedPage from './pages/Mypage/purchased';
import SalesPage from './pages/Mypage/sales';
import FavPage from './pages/Mypage/fav';
import TalkPage from './pages/Mypage/talk';
import PostPage from './pages/post';
import AllPage from './pages/allpage';
import TimeoutPage from './pages/timeoutpage';
import SoldoutPage from './pages/soldoutpage';
import { AppProvider } from './context/AppContext';
import './App.css';

const Default = ({ children }) => {
  const location = useLocation();

  // '/post'와 '/mypage'로 시작하는지 확인
  const hideNavBar = location.pathname === '/post' || location.pathname.startsWith('/mypage');

  return (
    <div className="basic">
      <Header />
      {!hideNavBar && <NavBar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppProvider> {/* Context Provider로 감싸기 */}
        <Default>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/mypage" element={<MyPage />}>
              <Route index element={<SettingPage />} /> {/* 기본 페이지 설정 */}
              <Route path="purchased" element={<PurchasedPage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="fav" element={<FavPage />} />
              <Route path="talk" element={<TalkPage />} />
            </Route>
            <Route path="/post" element={<PostPage />} />
            <Route path="/all" element={<AllPage />} />
            <Route path="/timeout" element={<TimeoutPage />} />
            <Route path="/soldout" element={<SoldoutPage />} />
          </Routes>
        </Default>
      </AppProvider>
    </Router>
  );
}

export default App;
