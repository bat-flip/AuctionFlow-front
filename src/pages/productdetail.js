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

  // 상품 정보 가져오기
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

  // 입찰 내역 가져오기 및 WebSocket 설정
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/auction/bids/${itemId}`, {
          withCredentials: true,
        });
        setBids(response.data);
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      }
    };
  
    fetchBids();
  
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('웹소켓 연결 성공');
        client.subscribe(`/topic/auction/${itemId}`, (message) => {
          console.log('수신한 입찰 데이터:', message.body);
          try {
            const bidNotification = JSON.parse(message.body);
            console.log('파싱된 입찰 데이터:', bidNotification);
  
            // 새로운 입찰 정보를 기존 bids 배열에 추가
            setBids((prevBids) => [
              ...prevBids,
              {
                bidId: Date.now(), // 임시 ID, 실제 ID로 변경 필요
                userId: bidNotification.userId,
                userNickname: 'Unknown', // 사용자 닉네임을 서버에서 받아오는 방법 필요
                itemId: itemId,
                title: 'Auction Item', // 아이템 제목을 서버에서 받아오는 방법 필요
                bidAmount: bidNotification.bidAmount,
                bidTime: new Date().toISOString() // 현재 시간으로 설정
              }
            ]);
          } catch (e) {
            console.error('입찰 데이터 파싱 오류:', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
      debug: (str) => {
        console.log('STOMP debug', str);
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
              {bids.map((bid) => (
                <div key={bid.bidId} className="bid-item">
                  <span>{bid.bidAmount.toLocaleString()}원</span>
                </div>
              ))}
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
