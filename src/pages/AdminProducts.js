import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Card, Table, Button, Alert, Form, Badge, Spinner } from 'react-bootstrap';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', quantity: '', category_id: '', description: '', image: null });
  const [editId, setEditId] = useState(null);
  const [editProduct, setEditProduct] = useState({ title: '', price: '', quantity: '', category_id: '', description: '' });
  const [editImage, setEditImage] = useState(null); // Track selected image for edit

  // Fetch products and categories
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/v1/products'),
        api.get('/v1/categories'),
      ]);
      setProducts(Array.isArray(prodRes.data.products) ? prodRes.data.products : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products or categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (value !== null && value !== '') formData.append(key, value);
      });
      await api.post('/v1/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewProduct({ title: '', price: '', quantity: '', category_id: '', description: '', image: null });
      fetchProducts();
    } catch {
      setError('Failed to add product');
    }
  };

  // Edit product
  const handleEdit = (prod) => {
    setEditId(prod.id);
    setEditProduct({
      title: prod.title,
      price: prod.price,
      quantity: prod.quantity,
      category_id: prod.category_id,
      description: prod.description || '',
    });
    setEditImage(null); // Reset image selection on edit
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(editProduct).forEach(([key, value]) => {
        if (value !== null && value !== '') formData.append(key, value);
      });
      if (editImage) {
        formData.append('image', editImage);
      }
      await api.put(`/v1/products/${editId}`, formData, {
        // Do NOT set Content-Type; browser will set it automatically
      });
      setEditId(null);
      setEditProduct({ title: '', price: '', quantity: '', category_id: '', description: '' });
      setEditImage(null);
      fetchProducts();
    } catch {
      setError('Failed to update product');
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/v1/products/${id}`);
      fetchProducts();
    } catch {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card bg="light" text="dark" className="shadow">
            <Card.Body>
              <Card.Title as="h2" className="text-center mb-4">Product Management (Admin)</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form className="mb-3 row g-2 align-items-end" onSubmit={handleAdd}>
                <Col>
                  <Form.Group controlId="formTitle">
                    <Form.Label className="text-black">Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={newProduct.title}
                      onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                      required
                      className="bg-dark text-white border-white"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formPrice">
                    <Form.Label className="text-black">Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                      className="bg-dark text-white border-white"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formQuantity">
                    <Form.Label className="text-black">Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Quantity"
                      value={newProduct.quantity}
                      onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      required
                      className="bg-dark text-white border-white"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formCategory">
                    <Form.Label className="text-black">Category</Form.Label>
                    <Form.Select
                      value={newProduct.category_id}
                      onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })}
                      required
                      className="bg-dark text-white border-white"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name || cat.title}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formDescription">
                    <Form.Label className="text-black">Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="bg-dark text-white border-white"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formImage">
                    <Form.Label className="text-white">Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                      className="bg-dark text-white border-white"
                    />
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  <Button variant="light" type="submit" className="text-dark fw-bold">Add</Button>
                </Col>
              </Form>
              {loading ? (
                <Spinner animation="border" variant="light" />
              ) : (
                <Table bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod.id}>
                        <td>{prod.id}</td>
                        <td>
                          {editId === prod.id ? (
                            <Form onSubmit={handleEditSubmit} className="d-flex align-items-center">
                              <Form.Control
                                type="text"
                                value={editProduct.title}
                                onChange={e => setEditProduct({ ...editProduct, title: e.target.value })}
                                required
                                className="bg-dark text-white border-white me-2"
                              />
                              <Form.Control
                                type="text"
                                value={editProduct.description}
                                onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                                className="bg-dark text-white border-white me-2"
                              />
                              <Form.Control
                                type="number"
                                value={editProduct.price}
                                onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
                                required
                                className="bg-dark text-white border-white me-2"
                              />
                              <Form.Control
                                type="number"
                                value={editProduct.quantity}
                                onChange={e => setEditProduct({ ...editProduct, quantity: e.target.value })}
                                required
                                className="bg-dark text-white border-white me-2"
                              />
                              <Form.Select
                                value={editProduct.category_id}
                                onChange={e => setEditProduct({ ...editProduct, category_id: e.target.value })}
                                required
                                className="bg-dark text-white border-white me-2"
                              >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name || cat.title}</option>
                                ))}
                              </Form.Select>
                              {/* Image file input for edit */}
                              <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={e => setEditImage(e.target.files[0])}
                                className="bg-dark text-white border-white me-2"
                              />
                              {/* Image preview if a new image is selected */}
                              {editImage && (
                                <img
                                  src={URL.createObjectURL(editImage)}
                                  alt="Preview"
                                  style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 8 }}
                                />
                              )}
                              <Button variant="success" size="sm" type="submit" className="me-2">Save</Button>
                              <Button variant="secondary" size="sm" type="button" onClick={() => { setEditId(null); setEditImage(null); }}>Cancel</Button>
                            </Form>
                          ) : (
                            prod.title
                          )}
                        </td>
                        <td>{prod.description}</td>
                        <td>{prod.price}</td>
                        <td>{prod.quantity}</td>
                        <td>{categories.find(cat => cat.id === prod.category_id)?.name || categories.find(cat => cat.id === prod.category_id)?.title || ''}</td>
                        <td>{prod.quantity === 0 || prod.out_of_stock ? <Badge bg="danger">Out of Stock</Badge> : <Badge bg="success">In Stock</Badge>}</td>
                        <td>
                          <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(prod)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(prod.id)}>Delete</Button>
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
    </div>
  );
};

export default AdminProducts; 