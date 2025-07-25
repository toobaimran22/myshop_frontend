import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const AdminDashboard = () => (
  <div style={{ backgroundColor: '#fff', minHeight: '90vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '22vh' }}>
    <Row className="w-100 justify-content-center" style={{ margin: 0 }}>
      <Col md={8} lg={6} className="d-flex justify-content-center">
        <Card bg="light" text="dark" className="shadow w-100" style={{ maxWidth: 500 }}>
          <Card.Body>
            <Card.Title as="h1" className="text-center mb-4">Admin Dashboard</Card.Title>
            <ListGroup variant="flush">
              <ListGroup.Item style={{ backgroundColor: '#fff', borderColor: '#ddd' }}>
                <Link to="/admin/categories" style={{ color: '#000', textDecoration: 'none' }}>Manage Categories</Link>
              </ListGroup.Item>
              <ListGroup.Item style={{ backgroundColor: '#fff', borderColor: '#ddd' }}>
                <Link to="/admin/products" style={{ color: '#000', textDecoration: 'none' }}>Manage Products</Link>
              </ListGroup.Item>
              <ListGroup.Item style={{ backgroundColor: '#fff', borderColor: '#ddd' }}>
                <Link to="/admin/users" style={{ color: '#000', textDecoration: 'none' }}>Manage Users</Link>
              </ListGroup.Item>
              <ListGroup.Item style={{ backgroundColor: '#fff', borderColor: '#ddd' }}>
                <Link to="/admin/orders" style={{ color: '#000', textDecoration: 'none' }}>Manage Orders</Link>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

export default AdminDashboard; 