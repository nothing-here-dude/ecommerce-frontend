import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, Dropdown, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          E-Commerce Store
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/products">Products</Nav.Link>
          </Nav>

          {/* Search Form */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search products..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '200px' }}
            />
            <Button variant="outline-light" type="submit">
              <FaSearch />
            </Button>
          </Form>

          <Nav>
            {/* Cart */}
            <Nav.Link as={Link} to="/cart" className="position-relative">
              <FaShoppingCart />
              {itemCount > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.7rem' }}
                >
                  {itemCount}
                </Badge>
              )}
            </Nav.Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  <FaUser className="me-1" />
                  {user?.firstName || 'User'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    {user?.firstName} {user?.lastName}
                    <br />
                    <small className="text-muted">{user?.email}</small>
                  </Dropdown.Header>
                  <Dropdown.Divider />

                  <Dropdown.Item as={Link} to="/orders">
                    My Orders
                  </Dropdown.Item>

                  {isAdmin() && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/admin">
                        <FaUserShield className="me-1" />
                        Admin Dashboard
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/admin/add-product">
                        Add Product
                      </Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;