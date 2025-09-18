import React from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, loading, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading cart...</p>
        </div>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <FaShoppingBag size={64} className="text-muted mb-3" />
            <h2>Your cart is empty</h2>
            <p className="text-muted mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button as={Link} to="/products" variant="primary" size="lg">
              Start Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Shopping Cart</h1>
            <Button variant="outline-danger" onClick={clearCart} size="sm">
              Clear Cart
            </Button>
          </div>

          <Card>
            <Card.Body>
              {cartItems.map((item, index) => (
                <div key={item.id} className="cart-item">
                  <Row className="align-items-center">
                    <Col md={2}>
                      <img
                        src={item.image || '/api/placeholder/100/100'}
                        alt={item.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: '80px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col md={4}>
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="text-muted small mb-0">
                        ${item.price} each
                      </p>
                    </Col>
                    <Col md={3}>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={loading}
                        >
                          <FaMinus />
                        </Button>
                        <Form.Control
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                          min="0"
                          className="mx-2 text-center"
                          style={{ width: '70px' }}
                          disabled={loading}
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={loading}
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </Col>
                    <Col md={2} className="text-end">
                      <h6 className="mb-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </h6>
                    </Col>
                    <Col md={1} className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>

          <div className="mt-3">
            <Button as={Link} to="/products" variant="outline-primary">
              Continue Shopping
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top" style={{ top: '100px' }}>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>
                  {cartTotal >= 50 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    '$5.99'
                  )}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>
                  ${(cartTotal + (cartTotal >= 50 ? 0 : 5.99) + (cartTotal * 0.08)).toFixed(2)}
                </strong>
              </div>

              {cartTotal < 50 && (
                <Alert variant="info" className="small">
                  Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                </Alert>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-100"
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Button>

              {!isAuthenticated && (
                <p className="text-center text-muted small mt-2">
                  You need to login to proceed with checkout
                </p>
              )}
            </Card.Body>
          </Card>

          {/* Security badges */}
          <Card className="mt-3">
            <Card.Body className="text-center">
              <h6>Secure Checkout</h6>
              <p className="small text-muted mb-0">
                Your payment information is encrypted and secure
              </p>
              <div className="mt-2">
                <span className="badge bg-light text-dark me-1">SSL</span>
                <span className="badge bg-light text-dark me-1">256-bit</span>
                <span className="badge bg-light text-dark">Encrypted</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;