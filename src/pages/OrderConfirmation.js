import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => (
  <Container className="py-5 bg-white text-dark text-center">
    <h2 className="mb-4">Thank You for Your Order!</h2>
    <p>Your order has been placed successfully. You will receive a confirmation email soon.</p>
    <Button as={Link} to="/products" variant="dark" className="mt-3">
      Continue Shopping
    </Button>
  </Container>
);

export default OrderConfirmation; 