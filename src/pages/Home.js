import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Carousel, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { FaStar } from 'react-icons/fa';

const funTestimonials = [
  { rating: 5, author: "Alice" },
  { rating: 4, author: "Bob" },
  { rating: 5, author: "Charlie" },
  { rating: 4.5, author: "Dana" },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/v1/products', { params: { page: 1, per_page: 6 } });
        setProducts(res.data.products ? res.data.products.slice(0, 6) : res.data.slice(0, 6));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container fluid className="bg-light min-vh-100 p-0">
      {/* Banner Section */}
      <div className="bg-dark text-white text-center py-5 mb-4" style={{background: 'linear-gradient(90deg, #000 60%, #444 100%)'}}>
        <h4 className="fw-bold mb-3 animate__animated animate__fadeInDown" style={{ fontSize: '2rem' }}>Welcome to MyStore!</h4>
        <p className="lead mb-4 animate__animated animate__fadeInUp">Your one-stop shop for everything awesome. Discover deals, trends, and more!</p>
        <Button as={Link} to="/products" variant="light" size="md" className="fw-bold animate__animated animate__pulse animate__infinite">Shop Now</Button>
      </div>
      {/* Featured Products */}
      <Container className="mb-5">
        <h5 className="text-center mb-4 fw-bold text-black">Featured Products</h5>
        {loading ? (
          <div className="d-flex justify-content-center py-5"><Spinner animation="border" variant="dark" /></div>
        ) : (
          <Row className="g-4 justify-content-center">
            {products.map(product => (
              <Col key={product.id} xs={12} sm={6} md={2}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
        <div className="d-flex justify-content-center mt-4">
          <Link to="/products" className="fw-bold text-decoration-underline text-dark" style={{ fontSize: '1.1rem' }}>View All Products</Link>
        </div>
      </Container>
   
      <div className="bg-white py-5 border-top border-bottom">
        <h3 className="text-center mb-4 fw-bold">What Our Customers Say</h3>
        <Carousel indicators={false} interval={2000} className="w-75 mx-auto">
          {funTestimonials.map((t, idx) => (
            <Carousel.Item key={idx}>
              <Card className="shadow border-0 p-4 text-center" style={{ background: '#f8f9fa', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <Card.Body>
                  <div className="mb-2 d-flex justify-content-center align-items-center" style={{ minHeight: '36px' }}>
                    {[...Array(Math.floor(t.rating))].map((_, i) => (
                      <FaStar key={i} className="text-warning fs-4 mx-1" />
                    ))}
                    {t.rating % 1 !== 0 && <FaStar className="text-warning fs-4 mx-1" style={{ opacity: 0.5 }} />}
                  </div>
                  <div className="fw-bold fs-5 mb-1 text-dark">{t.rating} <span className="fs-6 text-muted">/ 5</span></div>
                  <footer className="blockquote-footer mt-2" style={{ fontWeight: 500, color: '#333' }}>{t.author}</footer>
                </Card.Body>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </Container>
  );
};

export default Home; 