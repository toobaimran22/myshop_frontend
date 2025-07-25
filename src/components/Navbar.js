import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Calculate total items in cart
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BootstrapNavbar bg="white" variant="light" expand="lg" className="py-2 shadow-sm border-bottom">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/products" className="fw-bold text-black">
          MyStore
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="position-relative me-2 text-black" style={{ padding: '0.25rem 0.5rem' }}>
              <FaHome size={16} />
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="position-relative me-2 text-black" style={{ padding: '0.25rem 0.5rem' }}>
              <FaShoppingCart size={16} />
              {cartCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle" style={{ fontSize: '0.65rem', padding: '0.2em 0.4em' }}>
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login" className="text-black">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="text-black">
                  Signup
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/orders" className="text-black me-2">
                  My Orders
                </Nav.Link>
                {user && user.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" className="text-black me-2">
                    Admin Dashboard
                  </Nav.Link>
                )}
                <div className="d-flex align-items-center me-3" style={{ gap: '0.4rem' }}>
                  <FaUser size={15} className="text-secondary" />
                  <span className="text-black" style={{ fontWeight: 500 }}>{user?.username}</span>
                </div>
                <Nav.Link as="span" onClick={handleLogout} className="text-black" style={{ cursor: 'pointer', fontWeight: 500 }}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
