import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaBox, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import { adminAPI, ordersAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsResponse, ordersResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        ordersAPI.getUserOrders({ limit: 5 })
      ]);

      setStats(statsResponse.data);
      setRecentOrders(ordersResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <Button as={Link} to="/admin/add-product" variant="success">
          <FaPlus className="me-1" />
          Add Product
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FaShoppingCart size={32} className="text-primary mb-2" />
              <h4 className="text-primary">{stats.totalOrders}</h4>
              <p className="text-muted mb-0">Total Orders</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FaUsers size={32} className="text-success mb-2" />
              <h4 className="text-success">{stats.totalUsers}</h4>
              <p className="text-muted mb-0">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FaBox size={32} className="text-info mb-2" />
              <h4 className="text-info">{stats.totalProducts}</h4>
              <p className="text-muted mb-0">Total Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <FaDollarSign size={32} className="text-warning mb-2" />
              <h4 className="text-warning">${stats.totalRevenue?.toFixed(2)}</h4>
              <p className="text-muted mb-0">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex gap-3 flex-wrap">
                <Button as={Link} to="/admin/add-product" variant="success">
                  <FaPlus className="me-1" />
                  Add New Product
                </Button>
                <Button as={Link} to="/products" variant="primary">
                  <FaBox className="me-1" />
                  View All Products
                </Button>
                <Button as={Link} to="/orders" variant="info">
                  <FaShoppingCart className="me-1" />
                  View All Orders
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Orders</h5>
            </Card.Header>
            <Card.Body>
              {recentOrders.length === 0 ? (
                <Alert variant="info" className="text-center">
                  No orders found
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>${order.total?.toFixed(2)}</td>
                        <td>
                          <Button
                            as={Link}
                            to={`/track-order/${order.id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            View
                          </Button>
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

      {/* System Information */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">System Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>API Base URL:</strong> http://localhost:8080/api</p>
                  <p><strong>Frontend Version:</strong> 1.0.0</p>
                </Col>
                <Col md={6}>
                  <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Environment:</strong> Development</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;