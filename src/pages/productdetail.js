import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import axios from 'axios'; // axios를 사용하여 API 요청을 처리
import './productdetail.css'; // CSS 파일을 추가하여 스타일링

function ProductDetailPage() {
  const { itemId } = useParams(); // URL 파라미터에서 itemId 가져오기
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 상품 세부 정보 가져오기
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/items/${itemId}`, {
          withCredentials: true, // 쿠키를 포함시키기 위해 추가
        });
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('상품 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [itemId]); // itemId가 변경될 때마다 호출

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>상품을 찾을 수 없습니다.</div>;

  // 조건부 렌더링을 통해 imageUrls가 존재하는지 확인
  const imageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[0]
    : 'https://via.placeholder.com/150';

  return (
    <div className="product-detail-container">
      <div className="product-detail-left">
      <div className="pd-store"><FaRegUser />{product.userId}님의 상점</div>
        <img
            src={imageUrl}
            alt={product.title}
            className="product-detail-image"
          />
        <div className="recent-price-container">
          <div className="recent-price-header">최근 제시가</div>
          <div className="recent-price">100,000원</div>
          <div className="recent-price-button-container">
            <button className="recent-price-button">제시가 더보기</button>
          </div>
        </div>
      </div>
      <div className="product-detail-right">
          <div className="pd-header-container">
              <div className="pd-name">{product.title}</div>
              <div className="pd-category">#{product.categoryId}</div>
          </div>
          <div className="pd-price-container">
              <div className="pd-price">{product.startingBid.toLocaleString()}원</div>
              <button className="wishlist-button">관심 상품에 추가</button>
          </div>
          <div className="pd-condition">
              <div className="condition-label">상품 상태</div>
              <div className="condition-value">: {product.productStatus}</div>
          </div>
          <div className="pd-description">
              <div className="description-header">상품 설명</div>
              <div className="description-value">{product.description}</div>
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
              <button className="offer-button">등 록</button>
              </div>
          </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
