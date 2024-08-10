import React, { useState, useRef } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import './setting.css';

function SettingPage() {
  const [storeImage, setStoreImage] = useState(null);
  const [addressObj, setAddressObj] = useState({
    zipcode: '',
    areaAddress: '',
    townAddress: ''
  });
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
  const [isAccountEditable, setIsAccountEditable] = useState(false);
  const logoImgInput = useRef(null);
  const postcodeScriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

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

  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = ''; //추가될 주소
    let localAddress = data.sido + ' ' + data.sigungu; //지역주소(시, 도 + 시, 군, 구)
    if (data.addressType === 'R') { //주소타입이 도로명주소일 경우
      if (data.bname !== '') {
        extraAddress += data.bname; //법정동, 법정리
      }
      if (data.buildingName !== '') { //건물명
        extraAddress += (extraAddress !== '' ? `, ${extraAddress}` : data.buildingName);
      }
      //지역주소 제외 전체주소 치환
      fullAddress = fullAddress.replace(localAddress, '');
      //조건 판단 완료 후 우편번호, 지역 주소 및 상세주소 state 수정
      setAddressObj({
        zipcode: data.zonecode, // 우편번호 추가
        areaAddress: localAddress,
        townAddress: fullAddress += (extraAddress !== '' ? `(${extraAddress})` : '')
      });
    }
  }

  const handleClick = () => {
    //주소검색이 완료되고, 결과 주소를 클릭 시 해당 함수 수행
    open({ onComplete: handleComplete });
  }

  const toggleEditable = (setter) => {
    setter(prev => !prev);
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
              <input
                type="text"
                placeholder="상점 이름을 설정해주세요."
                disabled={!isNameEditable}
              />
              <button
                className="StoreSet-button"
                onClick={() => toggleEditable(setIsNameEditable)}
              >
                {isNameEditable ? '확인' : '변경'}
              </button>
            </div>
            <div className="setting-subtitle">상점 소개</div>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="상점 소개를 입력해주세요."
                disabled={!isDescriptionEditable}
              />
              <button
                className="StoreSet-button"
                onClick={() => toggleEditable(setIsDescriptionEditable)}
              >
                {isDescriptionEditable ? '확인' : '변경'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="Info-section">
        <div className="setting-title">주소지 정보</div>
        <input
          type="text"
          className="zipcode-input"
          placeholder="우편번호"
          value={addressObj.zipcode}  // 우편번호 표시
          readOnly
        />
        <button className="StoreSet-button" onClick={handleClick}>주소 찾기</button>
        <input
          type="text"
          placeholder="주소를 입력해주세요."
          value={addressObj.areaAddress || addressObj.townAddress ? `${addressObj.areaAddress} ${addressObj.townAddress}` : ''}
          readOnly
        />
        <input type="text" placeholder="상세 주소를 입력해주세요." />
      </div>
      <div className="Info-section2">
        <div className="setting-title">계좌 정보</div>
        <input
          type="text"
          placeholder="계좌 정보를 입력해주세요."
          disabled={!isAccountEditable}
        />
        <button
          className="StoreSet-button"
          onClick={() => toggleEditable(setIsAccountEditable)}
        >
          {isAccountEditable ? '확인' : '변경'}
        </button>
      </div>
    </div>
  );
}

export default SettingPage;
