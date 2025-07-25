import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Button, Pagination, Card, InputGroup } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';
import { FaSearch, FaTag, FaDollarSign, FaList, FaFilter, FaTimes } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        ...filters,
      };
      const res = await api.get('/v1/products', { params });
      setProducts(res.data.products || res.data);
      setTotalPages(res.data.total_pages || 1);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/v1/categories');
        setCategories(res.data.categories || res.data); 
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts({
      title: title || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      category_name: category || undefined,
    });
    
  }, [title, minPrice, maxPrice, category, page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchProducts({
      title: title || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      category_name: category || undefined,
      page: 1,
    });
  };

  const handleCancelFilter = () => {
    setCategory('');
    setTitle('');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
    setShowFilters(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Container fluid className="bg-white text-black min-vh-100 py-1">
      <h3 className="text-center mb-4">Products</h3>
      {/* Filter Toggle Button */}
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="outline-dark"
          className="fw-bold btn-sm"
          onClick={() => setShowFilters((prev) => !prev)}
          aria-expanded={showFilters}
          aria-controls="product-filters"
        >
          <FaFilter className="me-2" />Filter
        </Button>
      </div>
      
      {showFilters && (
        <Card className="mb-4 shadow-sm border-0" id="product-filters">
          <Card.Body>
            <Form onSubmit={handleFilterSubmit}>
              <Row className="g-3 align-items-end">
                {/* Category Dropdown */}
                <Col xs={12} sm={6} md={3}>
                  <Form.Group controlId="category">
                    <Form.Label className="fw-semibold"><FaList className="me-2" />Category</Form.Label>
                    <InputGroup>
                      <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-white text-dark border-secondary"
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </Col>
                {/* Title Filter */}
                <Col xs={12} sm={6} md={3}>
                  <Form.Group controlId="title">
                    <Form.Label className="fw-semibold"><FaTag className="me-2" />Title</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white text-dark border-secondary"><FaSearch /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Product title"
                        className="bg-white text-dark border-secondary"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                {/* Min Price */}
                <Col xs={12} sm={6} md={2}>
                  <Form.Group controlId="minPrice">
                    <Form.Label className="fw-semibold"><FaDollarSign className="me-2" />Min Price</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white text-dark border-secondary">$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        min="0"
                        className="bg-white text-dark border-secondary"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                {/* Max Price */}
                <Col xs={12} sm={6} md={2}>
                  <Form.Group controlId="maxPrice">
                    <Form.Label className="fw-semibold"><FaDollarSign className="me-2" />Max Price</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-white text-dark border-secondary">$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        min="0"
                        className="bg-white text-dark border-secondary"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                {/* Cancel Button */}
                <Col xs={12} sm={12} md={2} className="d-grid">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    className="fw-bold py-2 rounded-circle d-flex align-items-center justify-content-center"
                    onClick={handleCancelFilter}
                    aria-label="Clear filters"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <FaTimes />
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      )}
      {loading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="light" />
        </div>
      )}
      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}
      {!loading && !error && (
        <>
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={2}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center mt-4">
            <Pagination className="custom-pagination">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
              <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={page === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
            </Pagination>
          </div>
        </>
      )}
    </Container>
  );
};

export default Products;
