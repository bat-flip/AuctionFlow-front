import React from 'react';
import './fav.css';

const products = [
  { id: 1, title: 'Nike x Drake Nocta NRG', price: '150,200원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 2, title: 'Open Yy x Hello Kitty Shopper Tote Bag Silver', price: '98,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Arcteryx Aerios 18 Backpack Black', price: '300,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 4, title: '상품 4', price: '40,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 5, title: '상품 5', price: '50,000원', imageUrl: 'https://via.placeholder.com/150' },
  { id: 6, title: '상품 6', price: '60,000원', imageUrl: 'https://via.placeholder.com/150' }
];


function Favpage() {

  return (
    <div className="fav">
      <div className="fav-header">관심</div>
      <div className="fav-grid">
        {products.map((product) => (
          <div key={product.id} className="fav-card">
            <img src={product.imageUrl} alt={product.title} className="fav-image" />
            <div className="fav-title">{product.title}</div>
            <div className="fav-price">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favpage;
