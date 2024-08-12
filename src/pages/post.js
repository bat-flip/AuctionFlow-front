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
  const [productImages, setProductImages] = useState([]); // 이미지 상태 관리
  const imageInputRef = useRef(null);
  const navigate = useNavigate();

  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push({ id: Date.now() + Math.random(), src: reader.result }); // 고유 id 추가
        if (newImages.length === files.length) {
          setProductImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const triggerImageInput = () => {
    imageInputRef.current.click();
  };

  const handleImageDelete = (id) => {
    setProductImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const handleSubmit = () => {
    // 폼 제출 처리
    console.log('상품명:', productName);
    console.log('카테고리:', category);
    console.log('상품 상태:', status);
    console.log('설명:', description);
    console.log('가격:', price);
    console.log('종료 시간:', endTime);
    console.log('이미지:', productImages);

    // 폼 제출 후 이전 페이지로 돌아가기
    navigate(-1);
  };

  return (
    <div className="post-page">
      <div className="page-title">판매글 작성</div>
      <div className="form-group">
        <label>상품 이미지</label>
        <div className="PostImage-container" onClick={triggerImageInput}>
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
                &times; { /*삭제 버튼 */}
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
          onChange={handleProductNameChange}
          placeholder="상품명을 입력하세요."
        />
      </div>
      <hr />
      <div className="form-group">
        <label>카테고리</label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">선택하세요</option>
          <option value="electronics">전자제품</option>
          <option value="clothing">의류</option>
          <option value="home">가정용품</option>
          <option value="appliances">가전제품</option>
          {/* 다른 카테고리를 추가 */}
        </select>
      </div>
      <hr />
      <div className="form-group">
        <label>상품 상태</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="status"
              value="new"
              checked={status === 'new'}
              onChange={handleStatusChange}
            />
            새 상품(미사용)
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="used"
              checked={status === 'used'}
              onChange={handleStatusChange}
            />
            사용감 없음
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="refurbished"
              checked={status === 'refurbished'}
              onChange={handleStatusChange}
            />
            사용감 적음
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="damaged"
              checked={status === 'damaged'}
              onChange={handleStatusChange}
            />
            사용감 많음
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="other"
              checked={status === 'other'}
              onChange={handleStatusChange}
            />
            고장/파손 상품
          </label>
        </div>
      </div>
      <hr />
      <div className="form-group">
        <label>설명</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
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
          onChange={handlePriceChange}
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
              onChange={handleEndTimeChange}
            />
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="button-container">
          <button className="post-button" onClick={handleSubmit}>등록하기</button>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
