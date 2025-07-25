import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner, Modal } from 'react-bootstrap';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/orders');
      setOrders(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Approve order
  const handleApprove = async (id) => {
    try {
      await api.patch(`/v1/orders/${id}/approve`);
      fetchOrders();
    } catch {
      setError('Failed to approve order');
    }
  };

  // Show order details (fetch full details)
  const handleShowDetails = async (order) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const res = await api.get(`/v1/orders/${order.id}`);
      setSelectedOrder(res.data);
    } catch (err) {
      setModalError('Failed to fetch order details');
      setSelectedOrder(null);
    }
    setModalLoading(false);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card bg="light" text="dark" className="shadow">
            <Card.Body>
              <Card.Title as="h2" className="text-center mb-4">Order Management (Admin)</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              {loading ? (
                <Spinner animation="border" variant="light" />
              ) : (
                <Table bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user?.username}</td>
                        <td>{order.status}</td>
                        <td>{order.total_price !== undefined ? `$${Number(order.total_price).toFixed(2)}` : ''}</td>
                        <td>
                          <Button variant="info" size="sm" className="me-2" onClick={() => handleShowDetails(order)}>Details</Button>
                          {order.status !== 'approved' && (
                            <Button variant="success" size="sm" onClick={() => handleApprove(order.id)}>Approve</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Order Details Modal */}
      <Modal show={!!selectedOrder || modalLoading || modalError} onHide={handleCloseDetails} centered backdrop="static" contentClassName="bg-dark text-white">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalLoading ? (
            <Spinner animation="border" variant="light" />
          ) : modalError ? (
            <Alert variant="danger">{modalError}</Alert>
          ) : selectedOrder && (
            <>
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>User:</strong> {selectedOrder.user?.username || selectedOrder.user?.email || selectedOrder.user_id}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Total:</strong> {selectedOrder.total_price !== undefined ? `$${Number(selectedOrder.total_price).toFixed(2)}` : ''}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {(selectedOrder.items || selectedOrder.order_items)?.map((item, idx) => (
                  <li key={idx}>{item.product?.title || item.product_id} x {item.quantity}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders; 