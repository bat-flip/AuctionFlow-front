import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './componenets/header';
import NavBar from './componenets/nav';
import MainPage from './pages/main';
import MyPage from './pages/mypage';
import PostPage from './pages/post';
import AllPage from './pages/allpage';
import TimeoutPage from './pages/timeoutpage';
import SoldoutPage from './pages/soldoutpage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="basic">
        <Header />
        <NavBar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage/>}/>
          <Route path="/post" element={<PostPage />} />
          <Route path="/all" element={<AllPage />} />
          <Route path="/timeout" element={<TimeoutPage />} />
          <Route path="/soldout" element={<SoldoutPage />} />
        </Routes>
      </div>
    </Router>
  );
}
 
export default App;
