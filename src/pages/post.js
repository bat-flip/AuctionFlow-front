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
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
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
    setProductImages((prevImages) => [
      ...prevImages,
      ...files.map((file) => ({
        id: Date.now() + Math.random(),
        file,
        src: URL.createObjectURL(file)
      }))
    ]);
  };

  const triggerImageInput = () => {
    imageInputRef.current.click();
  };

  const handleImageDelete = (id) => {
    setProductImages((prevImages) => {
      const newImages = prevImages.filter((image) => image.id !== id);
      // 삭제된 이미지의 URL 해제
      const imageToDelete = prevImages.find((image) => image.id === id);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.src);
      }
      return newImages;
    });
  };

  const validateForm = () => {
    if (!productName || !category || !status || !description || !price || !endTime) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
  
    // JSON 데이터 추가
    formData.append('item', JSON.stringify({
      categoryId: category === 'electronics' ? 1 : category === 'clothing' ? 2 : category === 'home' ? 3 : 4,
      title: productName,
      productStatus: status,
      description: description,
      startingBid: parseFloat(price),
      auctionEndTime: endTime,
      itemBidStatus: 'Active',
    }));
  
    // 이미지 파일 추가
    productImages.forEach((image) => {
      formData.append('images', image.file); // images라는 키로 파일을 추가
    });
  
    try {
      const response = await fetch('http://localhost:8080/items', {
        method: 'POST',
        body: formData,
        credentials: 'include', // 세션 쿠키를 포함하여 요청
      });
  
      if (response.ok) {
        // 성공적으로 전송 후 폼 데이터 리셋
        setProductName('');
        setCategory('');
        setStatus('');
        setDescription('');
        setPrice('');
        setEndTime('');
        setProductImages([]);
        navigate(-1);
      } else {
        const errorText = await response.text(); // 서버에서 반환하는 에러 메시지 확인
        throw new Error(errorText || '서버에서 응답을 받지 못했습니다.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="post-page">
      <div className="post-title">판매글 작성</div>
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
              value="New"
              checked={status === 'New'}
              onChange={handleStatusChange}
            />
            새 상품(미사용)
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="Used"
              checked={status === 'Used'}
              onChange={handleStatusChange}
            />
            사용감 없음
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="Refurbished"
              checked={status === 'Refurbished'}
              onChange={handleStatusChange}
            />
            사용감 적음
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="Damaged"
              checked={status === 'Damaged'}
              onChange={handleStatusChange}
            />
            사용감 많음
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="Other"
              checked={status === 'Other'}
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
          <button 
            className="post-button" 
            onClick={handleSubmit}
            disabled={loading} // 로딩 중에는 버튼 비활성화
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </div>
      {/* 에러 메시지 */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default PostPage;
