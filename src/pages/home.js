import React from 'react';
import './pages.css'; // CSS 파일을 추가해 스타일링을 위한 클래스 이름을 정의할 수 있습니다.

const products = [
  { id: 1, title: 'Nike x Drake Nocta NRG', price: '150,200원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 2, title: 'Open Yy x Hello Kitty Shopper Tote Bag Silver', price: '98,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Arcteryx Aerios 18 Backpack Black', price: '300,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, title: '상품 4', price: '40,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 5, title: '상품 5', price: '50,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 6, title: '상품 6', price: '60,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 7, title: '상품 7', price: '20,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 8, title: '상품 8', price: '20,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 9, title: '상품 9', price: '20,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 10, title: '상품 10', price: '250,000원', imageUrl: 'https://via.placeholder.com/150' },
];

function HomePage() {
  return (
    <div className="products-container">
      <div className="pages-title">실시간 인기순위</div>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
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
