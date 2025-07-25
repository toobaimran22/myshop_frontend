import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Table, Form, Button, Alert } from 'react-bootstrap';
import api from '../api/axios';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/v1/orders', {
        shipping_address: form
      });
      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cities = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot",
    "Gujranwala",
    "Hyderabad",
    "Sukkur",
    "Bahawalpur",
    "Sargodha",
    "Rahim Yar Khan",
    "Jhang",
    "Sheikhupura",
    "Larkana",
    "Gujrat",
    "Mardan"
  ];

  return (
    <Container className="py-5 bg-white text-dark">
      <h2 className="mb-4">Checkout</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={7}>
          <h4>Shipping Information</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={form.address} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Select
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button type="submit" variant="dark" disabled={loading || cart.length === 0}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Form>
        </Col>
        <Col md={5}>
          <h4>Order Summary</h4>
          <Table bordered className="mb-3">
            <tbody>
              {cart.map(item => (
                <tr key={item.product.id}>
                  <td>{item.product.title} x {item.quantity}</td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td className="fw-bold">Total</td>
                <td className="fw-bold">${subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout; 