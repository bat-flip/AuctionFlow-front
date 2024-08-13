import React, { useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import './pages.css';

const initialProducts = [
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
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 1.0,
    triggerOnce: false,
  });

  const loadMoreProducts = useCallback(() => {
    if (!inView) return;

    const newProducts = [
      { id: 11, title: `상품 ${page * 10 + 1}`, price: '30,000원', imageUrl: 'https://via.placeholder.com/150' },
      { id: 12, title: `상품 ${page * 10 + 2}`, price: '40,000원', imageUrl: 'https://via.placeholder.com/150' },
      { id: 13, title: `상품 ${page * 10 + 3}`, price: '50,000원', imageUrl: 'https://via.placeholder.com/150' },
      { id: 14, title: `상품 ${page * 10 + 4}`, price: '60,000원', imageUrl: 'https://via.placeholder.com/150' },
      // 추가 상품...
    ];

    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    setPage((prevPage) => prevPage + 1);
  }, [inView, page]);

  React.useEffect(() => {
    loadMoreProducts();
  }, [loadMoreProducts]);

  return (
    <div className="products-container">
      <div className="pages-title">전체 목록</div>
      <div className="product-grid">
        {products.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="product-link">
            <div className="product-card">
              <img src={product.imageUrl} alt={product.title} className="product-image" />
              <div className="product-title">{product.title}</div>
              <div className="product-price">{product.price}</div>
            </div>
          </Link>
        ))}
      </div>
      <div ref={ref} className="loading">Loading...</div>
    </div>
  );
}

export default HomePage;
