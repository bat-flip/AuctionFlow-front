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
  const [displayedBids, setDisplayedBids] = useState([]);
  const [page, setPage] = useState(0); // 현재 페이지를 추적
  const [hasMoreBids, setHasMoreBids] = useState(true); // 더 많은 입찰이 있는지 확인
  const [bidError, setBidError] = useState(''); // 입찰 오류 메시지 상태

  const BIDS_PER_PAGE = 5; // 페이지당 입찰 수

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

        // 입찰 시간으로 정렬
        const sortedBids = response.data.sort((a, b) => new Date(b['bidTime']) - new Date(a['bidTime']));
        setBids(sortedBids);
        setDisplayedBids(sortedBids.slice(0, BIDS_PER_PAGE)); // 첫 페이지로 초기화
        setHasMoreBids(sortedBids.length > BIDS_PER_PAGE); // 더 많은 입찰이 있는지 확인
      } catch (error) {
        console.error('Failed to fetch bids:', error);
      }
    };

    fetchBids();

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/auction/${itemId}`, (message) => {
          const bid = JSON.parse(message.body);
          setBids((prevBids) => {
            const updatedBids = [bid, ...prevBids].sort((a, b) => new Date(b['bidTime']) - new Date(a['bidTime']));
            setDisplayedBids(updatedBids.slice(0, (page + 1) * BIDS_PER_PAGE)); // 페이지에 따라 표시된 입찰 업데이트
            setBids(updatedBids); // 모든 입찰 상태 업데이트
            return updatedBids;
          });
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [itemId, page]);

  // 입찰 금액 유효성 검사 및 제출
  const handleBidSubmit = async () => {
    try {
      await axios.post(`http://localhost:8080/auction/bid`, null, {
        params: { itemId, bidAmount },
        withCredentials: true,
      });
      alert("입찰이 성공적으로 완료되었습니다.");
      setBidAmount(''); // 입력 필드 초기화
      setBidError(''); // 오류 메시지 초기화
    } catch (error) {
      alert(error.response?.data || "입찰에 실패했습니다.");
    }
  };

  // 더 많은 입찰 로드
  const loadMoreBids = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      const newDisplayCount = newPage * BIDS_PER_PAGE;
      const nextBids = bids.slice(0, newDisplayCount);
      
      setDisplayedBids(nextBids);
      setHasMoreBids(bids.length > newDisplayCount);
      return newPage;
    });
  };

  // 관심 상품 추가
  const handleAddToWishlist = async () => {
    try {
      await axios.post(
        `http://localhost:8080/mypage/like`,
        { itemId }, // 데이터 본문에 itemId를 포함
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json', // 요청 본문 형식 설정
          },
        }
      );
      alert('관심 상품에 추가되었습니다.');
    } catch (error) {
      alert(error.response?.data || '관심 상품 추가에 실패했습니다.');
    }
  };

  // 입찰 금액 유효성 검사
  const validateBidAmount = (value) => {
    const parsedBidAmount = parseInt(value, 10);
    if (isNaN(parsedBidAmount) || parsedBidAmount % 100 !== 0) {
      setBidError("입찰 금액은 100원 단위로 가능합니다.");
    } else {
      setBidError('');
    }
  };

  // 입찰 금액 입력 처리
  const handleBidAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 허용
    setBidAmount(value);
    validateBidAmount(value);
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
          {displayedBids.length > 0 ? (
            <div className="recent-price">
              {displayedBids.map((bid) => (
                <div key={bid.bidId} className="bid-item">
                  <span>{bid.bidAmount.toLocaleString()}원</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="recent-price">입찰이 없습니다</div>
          )}
          {hasMoreBids && (
            <div className="recent-price-button-container">
              <button className="recent-price-button" onClick={loadMoreBids}>
                제시가 더보기
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="product-detail-right">
        <div className="pd-header-container">
          <div className="pd-name">{product.title}</div>
          <div className="pd-category">#{product.categoryName}</div>
        </div>
        <div className="pd-price-container">
          <div className="pd-price">{product.startingBid.toLocaleString()}원</div>
          <button className="wishlist-button" onClick={handleAddToWishlist}>관심 상품에 추가</button>
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
            <div className="offer-description">&nbsp;(원하는 금액을 제시해주세요. 입찰은 100원 단위로 가능합니다.)</div>
          </div>
          <div className="offer-input">
            <input
              type="text"
              placeholder="제시가 입력"
              className="offer-value"
              value={bidAmount}
              onChange={handleBidAmountChange}
            />
            <button className="offer-button" onClick={handleBidSubmit}>등 록</button>
          </div>
          {bidError && <div className="bid-error">{bidError}</div>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
