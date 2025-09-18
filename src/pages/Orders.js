import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEye, FaBox, FaShippingFast } from 'react-icons/fa';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', text: 'Pending' },
      processing: { variant: 'info', text: 'Processing' },
      shipped: { variant: 'primary', text: 'Shipped' },
      delivered: { variant: 'success', text: 'Delivered' },
      cancelled: { variant: 'danger', text: 'Cancelled' }
    };

    const config = statusConfig[status?.toLowerCase()] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await ordersAPI.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading your orders...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Orders</h1>
        <Button as={Link} to="/products" variant="primary">
          Continue Shopping
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <FaBox size={64} className="text-muted mb-3" />
            <h3>No orders yet</h3>
            <p className="text-muted mb-4">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button as={Link} to="/products" variant="primary" size="lg">
              Start Shopping
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="mb-4">
              <Card.Header>
                <Row className="align-items-center">
                  <Col md={3}>
                    <strong>Order #{order.id}</strong>
                  </Col>
                  <Col md={3}>
                    <small className="text-muted">
                      Placed on {formatDate(order.createdAt)}
                    </small>
                  </Col>
                  <Col md={3}>
                    {getStatusBadge(order.status)}
                  </Col>
                  <Col md={3} className="text-end">
                    <strong>${order.total?.toFixed(2)}</strong>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <h6>Items:</h6>
                    {order.items?.map((item, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image || '/api/placeholder/50/50'}
                            alt={item.name}
                            className="me-3 rounded"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                          <div>
                            <div>{item.name}</div>
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                        </div>
                        <div>${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}

                    {order.shippingAddress && (
                      <div className="mt-3">
                        <h6>Shipping Address:</h6>
                        <address className="mb-0">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                        </address>
                      </div>
                    )}
                  </Col>
                  <Col md={4}>
                    <div className="border-start ps-3">
                      <h6>Order Summary:</h6>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Subtotal:</span>
                        <span>${order.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Shipping:</span>
                        <span>${order.shipping?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Tax:</span>
                        <span>${order.tax?.toFixed(2)}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total:</strong>
                        <strong>${order.total?.toFixed(2)}</strong>
                      </div>

                      {order.trackingNumber && (
                        <div className="mt-3">
                          <small className="text-muted">Tracking Number:</small><br />
                          <code>{order.trackingNumber}</code>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    as={Link}
                    to={`/track-order/${order.id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    <FaEye className="me-1" />
                    Track Order
                  </Button>

                  {order.status?.toLowerCase() === 'pending' && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel Order
                    </Button>
                  )}

                  {order.status?.toLowerCase() === 'delivered' && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      disabled
                    >
                      Order Complete
                    </Button>
                  )}
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}

      {/* Order Statistics */}
      {orders.length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">Order Statistics</h5>
          </Card.Header>
          <Card.Body>
            <Row className="text-center">
              <Col md={3}>
                <div className="border-end">
                  <h4 className="text-primary">{orders.length}</h4>
                  <small className="text-muted">Total Orders</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="border-end">
                  <h4 className="text-success">
                    ${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                  </h4>
                  <small className="text-muted">Total Spent</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="border-end">
                  <h4 className="text-info">
                    {orders.filter(order => order.status?.toLowerCase() === 'delivered').length}
                  </h4>
                  <small className="text-muted">Delivered</small>
                </div>
              </Col>
              <Col md={3}>
                <div>
                  <h4 className="text-warning">
                    {orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status?.toLowerCase())).length}
                  </h4>
                  <small className="text-muted">In Progress</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Orders;