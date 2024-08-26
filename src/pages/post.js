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
    return productName && category && status && description && price && endDate && endHour && endMinute;
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
      itemBidStatus: 'Active',
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
      </div>
      <hr />
      <div className="form-group">
        <label>카테고리</label>
        <select
          id="category"
          value={category}
          class="options"
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
      </div>
      <hr />
      <div className="form-group">
        <label>가격</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={handleInputChange(setPrice)}
          placeholder="가격을 입력하세요."
          min="0"
        />
        &nbsp; 원
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
