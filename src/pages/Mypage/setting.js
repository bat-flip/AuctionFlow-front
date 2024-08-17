import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useApp } from '../../context/AppContext';
import './setting.css';

function SettingPage() {
  const [storeImage, setStoreImage] = useState(null);
  const [addressObj, setAddressObj] = useState({
    postcode: '',
    basicAddr: '',
    detailAddr: ''
  });
  const [storeData, setStoreData] = useState({}); // 상점 데이터 초기화
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const { userInfo } = useApp(); // 로그인한 사용자 정보
  const logoImgInput = useRef(null);
  const postcodeScriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  const open = useDaumPostcodePopup(postcodeScriptUrl);

  useEffect(() => {
    if (userInfo) {
      // 로그인한 사용자 ID를 기반으로 상점 데이터 로드
      const loadStoreData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/mypage/store/${userInfo.id}`, { withCredentials: true });
          setStoreData(response.data);
          setStoreImage(response.data.image); // 초기 이미지 설정
          setAddressObj({
            postcode: response.data.address?.postcode || '',
            basicAddr: response.data.address?.basicAddr || '',
            detailAddr: response.data.address?.detailAddr || ''
          }); // 초기 주소 설정
        } catch (error) {
          console.error('상점 데이터 로드 오류:', error);
        }
      };

      loadStoreData();
    }
  }, [userInfo]);

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

  const handleComplete = (data) => {
    setAddressObj({
      postcode: data.zonecode,
      basicAddr: `${data.sido} ${data.sigungu} ${data.address}`,
      detailAddr: data.bname ? `${data.bname} ${data.buildingName || ''}`.trim() : data.buildingName || ''
    });
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const toggleEditing = () => {
    setIsEditing(prev => !prev);
  };

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/mypage/store', // 기본 URL
    withCredentials: true,
  });

  const createStore = async (storeData) => {
    try {
      const response = await axiosInstance.post('', storeData);
      return response.data;
    } catch (error) {
      console.error('상점 생성 오류:', error);
      throw error;
    }
  };

  const updateStore = async (storeId, storeData) => {
    try {
      const response = await axiosInstance.patch(`/${storeId}`, storeData);
      return response.data;
    } catch (error) {
      console.error('상점 업데이트 오류:', error);
      throw error;
    }
  };

  const handleStoreSave = async () => {
    try {
      const storeDataToSave = {
        name: document.getElementById('storeName').value,
        content: document.getElementById('storeDescription').value,
        postcode: addressObj.postcode,
        basicAddr: addressObj.basicAddr,
        detailAddr: addressObj.detailAddr,
        image: storeImage
      };
      if (storeData.id) {
        await updateStore(storeData.id, storeDataToSave); // 기존 상점 업데이트
      } else {
        await createStore(storeDataToSave); // 새로운 상점 생성
      }
      alert('상점 정보가 저장되었습니다.');
    } catch (error) {
      alert('상점 정보 저장에 실패했습니다.');
    }
  };


  return (
    <div className="setting">
      <div className="setting-header">내 정보 / 상점 관리</div>
      <div className="User-section">
        <div className="setting-title">내 정보</div>
        <div className="UserInfo">{userInfo ? `${userInfo.nickname}` : '로그인이 필요합니다.'}</div>
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
            {isEditing && (
              <>
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
              </>
            )}
          </div>
          <div className="Store-info">
            <div className="setting-subtitle">상점 이름</div>
            <input
              id="storeName"
              type="text"
              placeholder="상점 이름을 설정해주세요."
              disabled={!isEditing}
              defaultValue={storeData.name || ''} // 저장된 값으로 수정
            />
            <div className="setting-subtitle">상점 소개</div>
            <input
              id="storeDescription"
              type="text"
              placeholder="상점 소개를 입력해주세요."
              disabled={!isEditing}
              defaultValue={storeData.content || ''} // 저장된 값으로 수정
            />
          </div>
        </div>
      </div>
      <div className="Info-section">
        <div className="setting-title">주소지 정보</div>
        <input
          type="text"
          className="zipcode-input"
          placeholder="우편번호"
          value={addressObj.postcode}
          readOnly
        />
        <button className="StoreSet-button" onClick={handleClick}>주소 찾기</button>
        <input
          type="text"
          placeholder="기본 주소를 입력해주세요."
          value={addressObj.basicAddr}
          readOnly
        />
        <input
          type="text"
          placeholder="상세 주소를 입력해주세요."
          value={addressObj.detailAddr}
          onChange={(e) => setAddressObj(prev => ({ ...prev, detailAddr: e.target.value }))}
          disabled={!isEditing}
        />
      </div>
      {/* <div className="Info-section2">
        <div className="setting-title">계좌 정보</div>
        <input
          type="text"
          placeholder="계좌 정보를 입력해주세요."
          disabled={!isEditing}
          defaultValue={storeData.account || ''} // 저장된 값으로 수정
        />
      </div> */}
      <button className="StoreSet-button" onClick={toggleEditing}>
        {isEditing ? '수정 취소' : '수정하기'}
      </button>
      {isEditing && (
        <button className="StoreSet-button" onClick={handleStoreSave}>저장</button>
      )}
    </div>
  );
}

export default SettingPage;


// 일단 계좌 등록 부분 없앰
// GET 관련해서 로그인한사람 과 상점 정보 주인 일치하는지,
// 그렇게 해서 불러온다음에 null 값이면 POST고 null 값이 아니면 PATCH
// 개별 수정으로도 할 수 있는지 해결해보기
// 개별 수정이 안된다면 로그인을 한번 더 함으로써 인증이 필요할 것 같음