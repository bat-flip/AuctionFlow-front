import React from 'react';
import { useParams } from 'react-router-dom';
import './productdetail.css'; // CSS 파일을 추가하여 스타일링

function ProductDetailPage() {
  const { id } = useParams();

  return (
    <div className="product-detail-container">
      <div className="product-detail-left">
        <img
          src={`https://via.placeholder.com/150`}
          alt={`Product ${id}`}
          className="product-detail-image"
        />
        <div className="recent-price-container">
          <div className="recent-price-header">최근 제시가</div>
          <div className="recent-price">100,000원</div>
        </div>
      </div>
      <div className="product-detail-right">
          <div className="pd-store">상점 이름</div>
          <div className="pd-header-container">
              <div className="pd-name">상품 이름</div>
              <div className="pd-category">#카테고리</div>
          </div>
          <div className="pd-price">150,000원~</div>
          <div className="pd-condition">
              <div className="condition-label">상품 상태</div>
              <div className="condition-value">: 새상품</div>
          </div>
          <div className="pd-description">
              <div className="description-header">상품 설명</div>
              <div className="description-value">상품 설명 어쩌고저쩌고</div>
          </div>
          <div className="purchase-offer">
              <div className="offer-title">
                <div className="offer-header">구매 제시가</div>
                <div className="offer-description">&nbsp;(원하는 금액을 제시해주세요. 500원 단위로 가능합니다.)</div>
              </div>
              <div className="offer-input">
              <input
                  type="text"
                  placeholder="제시가 입력"
                  className="offer-value"
              />
              <button className="offer-button">등록</button>
              </div>
          </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
