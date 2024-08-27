import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './productdetail.css';

function ProductDetailPage() {
  const { itemId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/items/${itemId}`, {
          withCredentials: true,
        });
        setProduct(response.data);
      } catch (error) {
        setError('상품 정보가 존재하지 않습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [itemId]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/auction/${itemId}`, (message) => {
          const bid = JSON.parse(message.body);
          setBids((prevBids) => [...prevBids, bid]);
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [itemId]);

  const handleBidSubmit = async () => {
    try {
      await axios.post(`http://localhost:8080/auction/bid`, null, {
        params: { itemId, bidAmount },
        withCredentials: true,
      });
      alert("입찰이 성공적으로 완료되었습니다.");
    } catch (error) {
      alert(error.response?.data || "입찰에 실패했습니다.");
    }
  };

  if (loading || error || !product) {
    return (
      <div>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && !product && <div>상품을 찾을 수 없습니다.</div>}
      </div>
    );
  }

  const imageUrl = product.productImageUrls && product.productImageUrls.length > 0
    ? product.productImageUrls[0]
    : 'https://via.placeholder.com/150';

  return (
    <div className="product-detail-container">
      <div className="product-detail-left">
        <div className="pd-store">
          <FaRegUser /> {product.userName} 님의 상점
        </div>
        <img
          src={imageUrl}
          alt={product.title}
          className="product-detail-image"
        />
        <div className="recent-price-container">
        <div className="recent-price-header">최근 제시가</div>
          {bids.length > 0 ? (
            <div className="recent-price">
              {bids[bids.length - 1].bidAmount.toLocaleString()}원
            </div>
          ) : (
            <div className="recent-price">입찰이 없습니다</div>
          )}
          <div className="recent-price-button-container">
            <button className="recent-price-button">제시가 더보기</button>
          </div>
        </div>
      </div>
      <div className="product-detail-right">
        <div className="pd-header-container">
          <div className="pd-name">{product.title}</div>
          <div className="pd-category">#{product.categoryName}</div>
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
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button className="offer-button" onClick={handleBidSubmit}>등 록</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
