import React, { useState, useRef } from 'react';
import './setting.css';

function SettingPage() {
  const [storeImage, setStoreImage] = useState(null);
  const logoImgInput = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    logoImgInput.current.click();
  };

  return (
    <div className="setting">
      <div className="setting-header">내 정보/상점 관리</div>
      <div className="User-section">
        <div className="setting-title">내 정보</div>
        <div className="UserInfo">김 익명 님</div>
      </div>
      <div className="Store-section">
        <div className="setting-title">상점 정보</div>
        <div className="StoreImage-container">
          <div className="StoreImage-wrapper">
            <div className="StoreImage">
              {storeImage ? (
                <img src={storeImage} alt="Store" className="StoreImage-preview" />
              ) : (
                '이미지칸'
              )}
            </div>
            <button className="StoreSet-button" onClick={triggerFileInput}>
              이미지 변경
            </button>
            <input
              ref={logoImgInput}
              type="file"
              accept="image/*"
              className="StoreImage-input"
              onChange={handleImageChange}
            />
          </div>
          <div className="Store-info">
            <div className="setting-subtitle">상점 이름</div>
              <div className="input-wrapper">
                <input type="text" placeholder="상점 이름을 설정해주세요." />
                <button className="StoreSet-button2">변경</button>
              </div>
              <div className="setting-subtitle">상점 소개</div>
              <div className="input-wrapper">
                <input type="text" placeholder="상점 소개를 입력해주세요." />
                <button className="StoreSet-button2">변경</button>
              </div>
          </div>
        </div>
      </div>
      <div className="Info-section">
        <div className="setting-title">주소지 정보</div>
        <input type="text" placeholder="주소를 입력해주세요." />
        <button className="StoreSet-button2">변경</button>
      </div>
      <div className="Info-section2">
        <div className="setting-title">계좌 정보</div>
        <input type="text" placeholder="계좌 정보를 입력해주세요." />
        <button className="StoreSet-button2">변경</button>
      </div>
    </div>
  );
}

export default SettingPage;
