import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => (
  <footer className="bg-white text-black pt-4 pb-2 mt-1 border-top" style={{ borderTopWidth: '1px' }}>
    <Container>
      <Row className="align-items-start gy-4">
        <Col md={4} sm={12}>
          <h5 className="fw-bold mb-2">MyShop</h5>
          <p className="mb-1">Your one-stop shop for everything awesome. Discover deals, trends, and more!</p>
          <div className="small text-muted">123 Commerce St, City, Country</div>
        </Col>
        <Col md={4} sm={6}>
          <h6 className="fw-bold mb-2">Quick Links</h6>
          <ul className="list-unstyled mb-0">
            <li><a href="/products" className="text-black text-decoration-none">Products</a></li>
            <li><a href="/cart" className="text-black text-decoration-none">Cart</a></li>
            
          </ul>
        </Col>
        <Col md={4} sm={6}>
          <h6 className="fw-bold mb-2">Contact</h6>
          <div className="mb-1">Email: <a href="mailto:support@myshop.com" className="text-black text-decoration-none">support@myshop.com</a></div>
          <div className="mb-1">Phone: <a href="tel:+1234567890" className="text-black text-decoration-none">+1 234 567 890</a></div>
          
        </Col>
      </Row>
      <hr className="border-muted my-3" />
      <Row>
        <Col className="text-center small text-muted">
          &copy; {new Date().getFullYear()} MyShop. All rights reserved.
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer; 