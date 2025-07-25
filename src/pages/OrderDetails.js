import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import { Card, Table, Spinner, Alert } from 'react-bootstrap';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/v1/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!order) return null;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Header>
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Date: {new Date(order.created_at).toLocaleString()}</p>
        </Card.Header>
        <Card.Body>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Product</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map(item => (
                <tr key={item.product.id}>
                  <td>{item.product.title}</td>
                  <td>${Number(item.product.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h5>Total: ${Number(order.total_price).toFixed(2)}</h5>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OrderDetails; 