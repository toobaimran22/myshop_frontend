import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Card, Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Assuming an endpoint exists to list all users
      const res = await api.get('/v1/users');
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Admin actions
  const handleActivate = async (id) => {
    try {
      await api.patch(`/v1/users/${id}/activate`);
      fetchUsers();
    } catch {
      setError('Failed to activate user');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await api.patch(`/v1/users/${id}/deactivate`);
      fetchUsers();
    } catch {
      setError('Failed to deactivate user');
    }
  };

  const handleAssignAdmin = async (id) => {
    try {
      await api.patch(`/v1/users/${id}/assign_admin`);
      fetchUsers();
    } catch {
      setError('Failed to assign admin role');
    }
  };

  const handleRemoveAdmin = async (id) => {
    try {
      await api.patch(`/v1/users/${id}/remove_admin`);
      fetchUsers();
    } catch {
      setError('Failed to remove admin role');
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card bg="light" text="dark" className="shadow">
            <Card.Body>
              <Card.Title as="h2" className="text-center mb-4">User Management (Admin)</Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              {loading ? (
                <Spinner animation="border" variant="light" />
              ) : (
                <Table bordered hover className="mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>{user.active ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>}</td>
                        <td>
                          {user.active ? (
                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleDeactivate(user.id)}>Deactivate</Button>
                          ) : (
                            <Button variant="success" size="sm" className="me-2" onClick={() => handleActivate(user.id)}>Activate</Button>
                          )}
                          {user.role === 'admin' ? (
                            <Button variant="secondary" size="sm" onClick={() => handleRemoveAdmin(user.id)}>Remove Admin</Button>
                          ) : (
                            <Button variant="primary" size="sm" onClick={() => handleAssignAdmin(user.id)}>Make Admin</Button>
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
    </div>
  );
};

export default AdminUsers; 