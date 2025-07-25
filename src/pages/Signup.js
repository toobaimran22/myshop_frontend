import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/v1/users', {
        user: {
          email,
          username,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      setEmail('');
      setUsername('');
      setPassword('');
      setPasswordConfirmation('');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Signup failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <Card bg="dark" text="white" className="shadow-lg p-4 rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="signupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-dark text-white border-white"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-dark text-white border-white"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-dark text-white border-white"
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="signupConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="bg-dark text-white border-white"
            />
          </Form.Group>
          <div className="d-grid">
            <Button variant="light" type="submit" className="text-dark fw-bold">
              Sign Up
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
