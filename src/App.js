import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './componenets/header';
import NavBar from './componenets/nav';
import MainPage from './pages/main';
import MyPage from './pages/mypage';
import PostPage from './pages/post';
import AllPage from './pages/allpage';
import TimeoutPage from './pages/timeoutpage';
import SoldoutPage from './pages/soldoutpage';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // List of paths where NavBar should not be rendered
  const noNavBarPaths = ['/post'];

  return (
    <div className="basic">
      <Header />
      {!noNavBarPaths.includes(location.pathname) && <NavBar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/all" element={<AllPage />} />
          <Route path="/timeout" element={<TimeoutPage />} />
          <Route path="/soldout" element={<SoldoutPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
