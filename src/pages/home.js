import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);  // 상품 데이터를 저장할 상태

  useEffect(() => {
    // 백엔드 API 호출 (쿠키 포함)
    fetch('http://localhost:8080/items', {
      method: 'GET',
      credentials: 'include',  // 쿠키를 포함하는 옵션
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('네트워크가 응답하지 않습니다.');
        }
        return response.json();
      })
      .then(data => {
        const formattedProducts = data.map(item => ({
          id: item.itemId,
          title: item.title,
          price: `${item.startingBid.toLocaleString()}원`,
          imageUrl: item.productImageUrls[0] || 'https://via.placeholder.com/150',  // 첫 번째 이미지 사용
        }));
        setProducts(formattedProducts);
      })
      .catch(error => console.error('상품을 불러오는데 오류가 발생했습니다.:', error));
  }, []);

  const handleCardClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="products-container">
      <div className="pages-title">실시간 인기순위</div>
      <div className="product-grid">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card" 
            onClick={() => handleCardClick(product.id)}  // 클릭 시 이동
          >
            <img src={product.imageUrl} alt={product.title} className="product-image" />
            <div className="product-title">{product.title}</div>
            <div className="product-price">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
