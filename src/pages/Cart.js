import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Button, Table, Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    updateCartItem(productId, Number(quantity));
  };

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Container className="py-5 bg-white text-dark">
      <h2 className="mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <Alert variant="info">Your cart is empty.</Alert>
      ) : (
        <>
          <Table bordered hover responsive className="align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product.id}>
                  <td>{item.product.title}</td>
                  <td>${item.product.price}</td>
                  <td style={{ maxWidth: 80 }}>
                    <Form.Control
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.product.id, e.target.value)
                      }
                    />
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemove(item.product.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="justify-content-end">
            <Col xs="auto">
              <h4>Total: ${subtotal.toFixed(2)}</h4>
              <Button variant="dark" onClick={handleCheckout} className="me-2">
                {user ? 'Checkout' : 'Login to Checkout'}
              </Button>
              <Button variant="outline-secondary" onClick={clearCart}>
                Clear Cart
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart; 