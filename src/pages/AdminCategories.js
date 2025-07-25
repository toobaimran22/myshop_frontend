import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Card, Table, Button, Alert, Form, Spinner } from 'react-bootstrap';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/categories');
      setCategories(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await api.post('/v1/categories', { category: { name: newCategory } });
      setNewCategory('');
      fetchCategories();
    } catch {
      setError('Failed to add category');
    }
  };

  // Edit category
  const handleEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/v1/categories/${editId}`, { category: { name: editName } });
      setEditId(null);
      setEditName('');
      fetchCategories();
    } catch {
      setError('Failed to update category');
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/v1/categories/${id}`);
      fetchCategories();
    } catch {
      setError('Failed to delete category');
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#fff', minHeight: '100vh'}}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card bg="light" text="dark" className="shadow">
            <Card.Body>
              <Card.Title as="h2" className="text-center mb-4">Category Management (Admin)</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form className="mb-3 d-flex" onSubmit={handleAdd}>
                <Form.Control
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="me-2"
                />
                <Button variant="light" type="submit" className="text-dark fw-bold">Add</Button>
              </Form>
              {loading ? (
                <Spinner animation="border" variant="light" />
              ) : (
                <Table bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id}>
                        <td>{cat.id}</td>
                        <td>
                          {editId === cat.id ? (
                            <Form onSubmit={handleEditSubmit} className="d-flex">
                              <Form.Control
                                type="text"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                autoFocus
                                className="bg-dark text-white border-white me-2"
                              />
                              <Button variant="success" size="sm" type="submit" className="me-2">Save</Button>
                              <Button variant="secondary" size="sm" type="button" onClick={() => setEditId(null)}>Cancel</Button>
                            </Form>
                          ) : (
                            cat.name
                          )}
                        </td>
                        <td>
                          <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(cat)}>Edit</Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>Delete</Button>
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

export default AdminCategories; 