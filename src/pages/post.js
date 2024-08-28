import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './post.css';

function PostPage() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const imageInputRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        src: URL.createObjectURL(file)
      }))
    ]);
  };

  const handleImageDelete = (id) => {
    setProductImages((prevImages) => {
      const newImages = prevImages.filter((image) => image.id !== id);
      const imageToDelete = prevImages.find((image) => image.id === id);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.src);
      }
      return newImages;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

  
    // 종료 시간 포맷 (입력된 날짜와 시간)
    const endDateTime = new Date(`${endDate}T${endHour}:${endMinute}:00`);
  
    // 필드가 비어 있는지 확인
    if (!productName) newErrors.productName = '상품명을 입력하세요.';
    if (!category) newErrors.category = '카테고리를 선택하세요.';
    if (!status) newErrors.status = '상품 상태를 선택하세요.';
    if (!description) newErrors.description = '설명을 입력하세요.';
    if (!price) newErrors.price = '가격을 입력하세요.';
    if (price <= 0) newErrors.price = '가격은 0보다 커야 합니다.';
  
  // 종료 시간 필드 검사
  if (!endDate || !endHour || !endMinute) {
    newErrors.endDate = '종료 시간을 입력하세요.';
  } else if (endDateTime <= now) {
    newErrors.endDate = '종료 시간은 현재 시간 이후여야 합니다.';
  }
  
    if (productImages.length === 0) newErrors.productImages = '상품 이미지를 추가하세요.';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const formatDateTime = (date, hour, minute) => {
    return `${date}T${hour}:${minute}:00`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append('item', JSON.stringify({
      categoryId: getCategoryID(category),
      title: productName,
      productStatus: status,
      description: description,
      startingBid: parseFloat(price),
      auctionEndTime: formatDateTime(endDate, endHour, endMinute),
      itemBidStatus: 'active',
    }));

    productImages.forEach((image) => {
      formData.append('images', image.file);
    });

    try {
      const response = await fetch('http://localhost:8080/items', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        resetForm();
        navigate(-1);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductName('');
    setCategory('');
    setStatus('');
    setDescription('');
    setPrice('');
    setEndDate('');
    setEndHour('');
    setEndMinute('');
    setProductImages([]);
    setErrors({});
  };

  const getCategoryID = (category) => {
    switch (category) {
      case 'clothing': return 1;
      case 'fashion-accessories': return 2;
      case 'electronics': return 3;
      case 'sports-leisure': return 4;
      case 'vehicles': return 5;
      case 'star-goods': return 6;
      case 'music-instruments': return 7;
      case 'books-tickets-stationery': return 8;
      case 'beauty': return 9;
      case 'furniture-home': return 10;
      case 'home-kitchen': return 11;
      case 'tools-industrial': return 12;
      case 'food': return 13;
      case 'baby-kids': return 14;
      case 'pet-supplies': return 15;
      case 'others': return 16;
      default: return 0;
    }
  };

  const generateHourOptions = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}` : i;
      hours.push(hour);
    }
    return hours;
  };

  const generateMinuteOptions = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
      const minute = i < 10 ? `0${i}` : i;
      minutes.push(minute);
    }
    return minutes;
  };

  // Function to handle price input change and validate
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      setPrice(value);
    }
  };

  return (
    <div className="post-page">
      <div className="post-title">판매글 작성</div>
      <div className="form-group">
        <label>상품 이미지</label>
        <div className="PostImage-container" onClick={() => imageInputRef.current.click()}>
          <div className="PostImage-message">
            이미지를<br/>등록해주세요.
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="image-input"
            onChange={handleImageChange}
          />
        </div>
        <div className="PostSubImage">
          {productImages.map((image) => (
            <div key={image.id} className="PostSubImage-item">
              <img src={image.src} alt={`PostSubImage ${image.id}`} className="PostSubImage-img" />
              <button
                className="PostSubImage-delete"
                onClick={() => handleImageDelete(image.id)}>
                &times;
              </button>
            </div>
          ))}
        </div>
        {errors.productImages && <div className="error-message">{errors.productImages}</div>}
      </div>
      <hr />
      <div className="form-group">
        <label>상품명</label>
        <input
          type="text"
          id="product-name"
          value={productName}
          onChange={handleInputChange(setProductName)}
          placeholder="상품명을 입력하세요."
        />
        {errors.productName && <div className="error-message">{errors.productName}</div>}
      </div>
      <hr />
      <div className="form-group">
        <label>카테고리</label>
        <select
          id="category"
          value={category}
          className="options"
          onChange={handleInputChange(setCategory)}
        >
          <option value="">선택하세요</option>
          <option value="clothing">의류</option>
          <option value="fashion-accessories">패션 액세서리</option>
          <option value="electronics">전자기기</option>
          <option value="sports-leisure">스포츠/레저</option>
          <option value="vehicles">차량/오토바이</option>
          <option value="star-goods">스타굿즈</option>
          <option value="music-instruments">음반/악기</option>
          <option value="books-tickets-stationery">도서/티켓/문구</option>
          <option value="beauty">뷰티/미용</option>
          <option value="furniture-home">가구/인테리어</option>
          <option value="home-kitchen">생활/주방용품</option>
          <option value="tools-industrial">공구/산업용품</option>
          <option value="food">식품</option>
          <option value="baby-kids">유아동/출산</option>
          <option value="pet-supplies">반려동물 용품</option>
          <option value="others">기타</option>
        </select>
        {errors.category && <div className="error-message">{errors.category}</div>}
      </div>
      <hr />
      <div className="form-group">
        <label>상품 상태</label>
        <div className="radio-group">
          {['새 상품(미개봉)', '사용감 없음', '사용감 적음', '사용감 많음', '고장 및 파손 상품'].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="status"
                value={value}
                checked={status === value}
                onChange={handleInputChange(setStatus)}
              />
              {value}
            </label>
          ))}
        </div>
        {errors.status && <div className="error-message">{errors.status}</div>}
      </div>
      <hr />
      <div className="form-group">
        <label>설명</label>
        <textarea
          id="description"
          value={description}
          onChange={handleInputChange(setDescription)}
          placeholder="상품 상세 설명을 적어주세요."
        />
        {errors.description && <div className="error-message">{errors.description}</div>}
      </div>
      <hr />
      <div className="form-group">
        <label>가격</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={handlePriceChange}
          placeholder="가격을 입력하세요."
          min="0"
        />
        &nbsp; 원
        {errors.price && <div className="error-message">{errors.price}</div>}
      </div>
      <hr />
      <div className="form-group">
        <label>종료 시간</label>
        <div className="time-settings">
          <div className="time-setting-group">
            <input
              className="options"
              type="date"
              id="end-date"
              value={endDate}
              onChange={handleInputChange(setEndDate)}
            />
          </div>
          <div className="time-setting-group">
            <select
              id="end-hour"
              className="options"
              value={endHour}
              onChange={handleInputChange(setEndHour)}
            >
              <option value="">시</option>
              {generateHourOptions().map((hour) => (
                <option key={hour} value={hour}>
                  {hour} 시
                </option>
              ))}
            </select>
          </div>
          <div className="time-setting-group">
            <select
              id="end-minute"
              className="options"
              value={endMinute}
              onChange={handleInputChange(setEndMinute)}
            >
              <option value="">분</option>
              {generateMinuteOptions().map((minute) => (
                <option key={minute} value={minute}>
                  {minute} 분
                </option>
              ))}
            </select>
          </div>
        </div>
        {errors.endDate && <div className="error-message">{errors.endDate}</div>}
      </div>
      <div className="form-group">
        <div className="button-container">
          <button 
            className="post-button" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
