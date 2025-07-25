import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <Card
      className="text-white bg-dark shadow-sm h-100"
      style={{ borderRadius: 0, position: 'relative', minHeight: '320px', maxHeight: '340px' }}
    >
      <Card.Img
        variant="top"
        src={product.image_url ? product.image_url : undefined}
        alt={product.title}
        style={{ objectFit: 'cover', height: '210px', background: '#eee', borderRadius: 0 }}
        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/250?text=No+Image'; }}
      />
      
      {product.quantity === 0 && (
        <Badge
          bg="danger"
          style={{ position: 'absolute', top: 10, right: 10, fontSize: '1rem', zIndex: 2 }}
        >
          Out of Stock
        </Badge>
      )}
      <Card.Body className="d-flex flex-column justify-content-end p-2" style={{ minHeight: '90px' }}>
        <Card.Title className="fw-semibold mb-1" style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</Card.Title>
        <Card.Text className="text-light mb-2" style={{ fontSize: '0.95rem' }}>${product.price}</Card.Text>
        <Button
          variant="light"
          className="text-dark fw-bold py-1"
          style={{ fontSize: '0.95rem' }}
          onClick={handleAddToCart}
          disabled={added || product.quantity === 0}
        >
          {product.quantity === 0 ? 'Out of Stock' : (added ? 'Added!' : 'Add to Cart')}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
