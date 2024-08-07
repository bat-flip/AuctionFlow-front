import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate로 변경
import './post.css';

function PostPage() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [endTime, setEndTime] = useState('');

  const navigate = useNavigate(); // useNavigate로 변경

  const handleProductNameChange = (e) => setProductName(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);

  const handleSubmit = () => {
    // 여기서 폼 데이터를 제출할 수 있습니다.
    console.log('상품명:', productName);
    console.log('카테고리:', category);
    console.log('상품 상태:', status);
    console.log('설명:', description);
    console.log('가격:', price);
    console.log('종료 시간:', endTime);

    // 폼 제출 후 이전 페이지로 돌아가기
    navigate(-1); // 또는 navigate('/')로 홈으로 이동
  };

  return (
    <div className="post-page">
      <div className="page-title">판매글 작성</div>
      <div className="form-group">
        <label>상품 이미지</label>
        <input
          type="file"
          id="product-image"
          accept="image/*"
        />
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
          {/* 더 많은 카테고리를 추가할 수 있습니다 */}
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
          placeholder="상품 상세 설명을 적어주세요. 브랜드, 모델명, 구매 시기, 하자 유무 등 최대한 자세히 적으면 좋아요."
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
        <small>최소 시작 가격은 1000원 단위로 가능합니다.</small>
      </div>
      <hr />
      <div className="form-group">
        <label>시간 설정</label>
        <div className="time-settings">
          <div>
            <label>종료 시간</label>
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
        <button className="submit-button" onClick={handleSubmit}>
          등록하기
        </button>
      </div>
    </div>
  );
}

export default PostPage;
