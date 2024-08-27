import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import axios from 'axios';
import './fav.css';

function Favpage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/mypage/like', {
          withCredentials: true, // 인증이 필요한 경우
        });
        setProducts(response.data);
      } catch (error) {
        setError('상품 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="fav">
      <div className="fav-header">관심 상품</div>
      <div className="fav-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <Link 
              key={product.itemId} 
              to={`/products/${product.itemId}`} // 클릭 시 이동할 경로 설정
              className="fav-card"
            >
              <img 
                src={product.productImageUrls[0] || 'https://via.placeholder.com/150'} 
                alt={product.title} 
                className="fav-image" 
              />
              <div className="fav-title">{product.title}</div>
              <div className="fav-price">{product.startingBid.toLocaleString()}원</div>
            </Link>
          ))
        ) : (
          <div>관심 상품이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default Favpage;
