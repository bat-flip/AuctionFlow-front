import React, { useState, useRef, useEffect } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useApp } from '../../context/AppContext';
import './setting.css';

function SettingPage() {
  const { userInfo, storeData, setStoreData } = useApp();
  const [storeImage, setStoreImage] = useState(null);
  const [addressObj, setAddressObj] = useState({
    zipcode: '',
    areaAddress: '',
    townAddress: ''
  });
  const [storeId, setStoreId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // 상점 정보 수정 상태
  const [isAddressEditing, setIsAddressEditing] = useState(false); // 주소지 수정 상태
  const [showMessage, setShowMessage] = useState(false); // 수정 완료 메시지 표시 상태
  const [message, setMessage] = useState(''); // 메시지 내용
  const logoImgInput = useRef(null);
  const postcodeScriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

  const open = useDaumPostcodePopup(postcodeScriptUrl);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await fetch('http://localhost:8080/mypage/store/storeInfo', {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('상점 정보를 가져오는 데 실패했습니다.');
        }

        const data = await response.json();
        setStoreId(data.storeId);
        setStoreImage(data.storeImage);
        setAddressObj({
          zipcode: data.postcode,
          areaAddress: data.basicAddr,
          townAddress: data.detailAddr
        });
        setStoreData({
          name: data.name,
          content: data.content
        });
        setIsEditing(false);
        setIsAddressEditing(false);
      } catch (error) {
        console.error('상점 정보를 가져오는 데 오류가 발생했습니다:', error);
      }
    };

    if (userInfo) {
      fetchStoreInfo();
    } else {
      // 로그아웃 상태에서는 상점 정보를 초기화
      setStoreId(null);
      setStoreImage(null);
      setAddressObj({
        zipcode: '',
        areaAddress: '',
        townAddress: ''
      });
      setStoreData({
        name: '',
        content: ''
      });
    }
  }, [setStoreData, userInfo]);

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

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';
    let localAddress = data.sido + ' ' + data.sigungu;

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      }
      fullAddress = fullAddress.replace(localAddress, '');
      setAddressObj({
        zipcode: data.zonecode,
        areaAddress: localAddress,
        townAddress: fullAddress += (extraAddress !== '' ? `(${extraAddress})` : '')
      });
    }
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const handleSave = async () => {
    const storeDTO = {
      name: storeData.name,
      content: storeData.content,
      postcode: parseInt(addressObj.zipcode, 10),
      basicAddr: addressObj.areaAddress,
      detailAddr: addressObj.townAddress
    };
  
    try {
      const response = storeId 
        ? await fetch(`http://localhost:8080/mypage/store`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(storeDTO)
          })
        : await fetch('http://localhost:8080/mypage/store', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(storeDTO)
          });
  
      if (!response.ok) {
        throw new Error('상점 정보를 저장하는 데 실패했습니다.');
      }
  
      const data = await response.json();
      console.log('상점이 저장되었습니다:', data);
      setStoreId(data.storeId); // 새로 등록한 경우, ID를 업데이트
      setIsEditing(false);
      setIsAddressEditing(false);

      // 수정 완료 메시지 표시
      setMessage('수정이 완료되었습니다.');
      setShowMessage(true);

      // 3초 후 메시지 숨기기
      setTimeout(() => setShowMessage(false), 3000);
    } catch (error) {
      console.error('상점 저장에 오류가 발생했습니다:', error);
      alert('상점 저장에 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleDelete = async () => {
    if (!storeId) {
      alert('삭제할 상점이 없습니다.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/mypage/store`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ storeId })
      });

      if (!response.ok) {
        throw new Error('상점을 삭제하는 데 실패했습니다.');
      }

      console.log('상점이 삭제되었습니다.');
      setStoreId(null); // 상점 ID 초기화
      setStoreImage(null); // 상점 이미지 초기화
      setAddressObj({ zipcode: '', areaAddress: '', townAddress: '' }); // 주소 초기화
      setStoreData({ name: '', content: '' }); // 상점 데이터 초기화
      setIsEditing(false);
      setIsAddressEditing(false);

      // 삭제 완료 메시지 표시
      setMessage('상점이 삭제되었습니다.');
      setShowMessage(true);

      // 3초 후 메시지 숨기기
      setTimeout(() => setShowMessage(false), 3000);
    } catch (error) {
      console.error('상점 삭제에 오류가 발생했습니다:', error);
      alert('상점 삭제에 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="setting">
      <div className="setting-header">내 정보/상점 관리</div>
      <div className="User-section">
        <div className="setting-title">내 정보</div>
        <div className="UserInfo">
          {userInfo ? `${userInfo.nickname}` : '로그인이 필요합니다.'}
        </div>
      </div>
      {userInfo && (
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
                  value={storeData.name || ''}
                  onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="setting-subtitle">상점 소개</div>
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="상점 소개를 입력해주세요."
                  value={storeData.content || ''}
                  onChange={(e) => setStoreData(prev => ({ ...prev, content: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {userInfo && (
        <div className="Info-section">
          <div className="setting-title">주소지 정보</div>
          <div className="input-wrapper">
            <input
              type="text"
              className="zipcode-input"
              placeholder="우편번호"
              value={addressObj.zipcode}
              readOnly
            />
            {isAddressEditing && (
              <button className="StoreSet-button" onClick={handleClick}>주소 찾기</button>
            )}
          </div>
          <input
            type="text"
            placeholder="주소를 입력해주세요."
            value={addressObj.areaAddress}
            onChange={(e) => setAddressObj(prev => ({ ...prev, areaAddress: e.target.value }))}
            disabled={!isAddressEditing}
          />
          <input
            type="text"
            placeholder="상세 주소를 입력해주세요."
            value={addressObj.townAddress}
            onChange={(e) => setAddressObj(prev => ({ ...prev, townAddress: e.target.value }))}
            disabled={!isAddressEditing}
          />
        </div>
      )}
      {userInfo && (
        <div className="setting-footer">
          <button
            className={isEditing || isAddressEditing ? 'StoreSet-button2OK' : 'StoreSet-button2'}
            onClick={() => {
              if (isEditing || isAddressEditing) {
                handleSave();
              }
              setIsEditing(!isEditing);
              setIsAddressEditing(!isAddressEditing);
            }}
          >
            {isEditing || isAddressEditing ? '저장' : '수정'}
          </button>
          {storeId && (
            <button
              className="StoreSet-button-delete"
              onClick={handleDelete}
            >
              삭제
            </button>
          )}
        </div>
      )}
      {showMessage && <div className="success-message">{message}</div>}
    </div>
  );
}

export default SettingPage;
