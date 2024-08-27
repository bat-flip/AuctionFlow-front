import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
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
  const [bidHistory, setBidHistory] = useState([]);

  useEffect(() => {
    // 상품 상세 정보와 입찰 내역을 가져오는 함수
    const fetchProductDetailsAndBids = async () => {
      try {
        // 상품 상세 정보 가져오기
        const productResponse = await axios.get(`http://localhost:8080/items/${itemId}`, {
          withCredentials: true,
        });
        setProduct(productResponse.data);

        // 입찰 내역 가져오기
        const bidsResponse = await axios.get(`http://localhost:8080/auction/bids/${itemId}`, {
          withCredentials: true,
        });
        setBidHistory(bidsResponse.data);

      } catch (error) {
        setError('상품 정보나 입찰 정보가 존재하지 않습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetailsAndBids();

    // WebSocket 연결 설정
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log('WebSocket에 연결되었습니다.');
        client.subscribe(`/topic/auction/${itemId}`, (message) => {
          const bidNotification = JSON.parse(message.body);
          setBidHistory((prevBids) => [...prevBids, bidNotification]);
        });
      },
      onStompError: (frame) => {
        console.error('브로커 오류:', frame.headers.message);
        console.error('추가 세부 사항:', frame.body);
      },
    });
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [itemId]);

  const handleBidSubmit = async () => {
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      alert('올바른 입찰 금액을 입력해주세요.');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/auction/bid`, null, {
        params: { itemId, bidAmount },
        withCredentials: true,
      });
      alert('입찰이 성공적으로 완료되었습니다.');
      setBidAmount(''); // 성공적으로 입찰 후 입력 필드 초기화
    } catch (error) {
      alert(error.response?.data || '입찰에 실패했습니다.');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
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
          <div className="recent-price">
            {bidHistory.length > 0 ? (
              <ul>
                {bidHistory.map(bid => (
                  <li key={bid.bidId}>
                    {bid.bidAmount.toLocaleString()}원
                  </li>
                ))}
              </ul>
            ) : (
              '없음'
            )}
          </div>
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
            <div className="offer-description"> (원하는 금액을 제시해주세요. 500원 단위로 가능합니다.)</div>
          </div>
          <div className="offer-input">
            <input
              type="number"
              placeholder="제시가 입력"
              className="offer-value"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button className="offer-button" onClick={handleBidSubmit}>등록</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
