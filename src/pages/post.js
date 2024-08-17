import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './post.css';

function PostPage() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [endTime, setEndTime] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    return productName && category && status && description && price && endTime;
  };

  const formatDateTime = (dateTime) => {
    if (dateTime.length === 16) { // Checks if seconds are missing
      return `${dateTime}:00`;
    }
    return dateTime;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
  
    formData.append('item', JSON.stringify({
      categoryId: getCategoryID(category),
      title: productName,
      productStatus: status,
      description: description,
      startingBid: parseFloat(price),
      auctionEndTime: formatDateTime(endTime),
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
      } else {
        const errorText = await response.text();
        throw new Error(errorText || '서버에서 응답을 받지 못했습니다.');
      }
    } catch (error) {
      setError(error.message);
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
    setEndTime('');
    setProductImages([]);
  };

  const getCategoryID = (category) => {
    switch (category) {
      case 'electronics': return 1;
      case 'clothing': return 2;
      case 'home': return 3;
      case 'appliances': return 4;
      default: return 0;
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
          onChange={handleInputChange(setCategory)}
        >
          <option value="">선택하세요</option>
          <option value="electronics">전자제품</option>
          <option value="clothing">의류</option>
          <option value="home">가정용품</option>
          <option value="appliances">가전제품</option>
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
          <div>
            <input
              type="datetime-local"
              id="end-time"
              value={endTime}
              onChange={handleInputChange(setEndTime)}
            />
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
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default PostPage;
