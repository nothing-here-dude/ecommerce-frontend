import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaClock, FaShippingFast, FaBox } from 'react-icons/fa';
import { ordersAPI } from '../services/api';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const [orderResponse, trackingResponse] = await Promise.all([
        ordersAPI.getOrderById(orderId),
        ordersAPI.trackOrder(orderId)
      ]);

      setOrder(orderResponse.data);
      setTracking(trackingResponse.data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      setError('Failed to load order details. Please try again.');
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

  const getProgressPercentage = (status) => {
    const statusProgress = {
      pending: 25,
      processing: 50,
      shipped: 75,
      delivered: 100,
      cancelled: 0
    };
    return statusProgress[status?.toLowerCase()] || 0;
  };

  const getProgressVariant = (status) => {
    const statusVariant = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return statusVariant[status?.toLowerCase()] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = (order) => {
    if (!order?.createdAt) return 'N/A';

    const orderDate = new Date(order.createdAt);
    const deliveryDays = order.shippingMethod === 'express' ? 3 : 7;
    const estimatedDate = new Date(orderDate.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));

    return estimatedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const trackingSteps = [
    {
      status: 'pending',
      title: 'Order Placed',
      description: 'Your order has been received and is being processed',
      icon: <FaClock />
    },
    {
      status: 'processing',
      title: 'Processing',
      description: 'Your order is being prepared for shipment',
      icon: <FaBox />
    },
    {
      status: 'shipped',
      title: 'Shipped',
      description: 'Your order has been shipped and is on its way',
      icon: <FaShippingFast />
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Your order has been delivered successfully',
      icon: <FaCheck />
    }
  ];

  const getCurrentStepIndex = (status) => {
    return trackingSteps.findIndex(step => step.status === status?.toLowerCase());
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading order details...</p>
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error || 'Order not found'}
        </Alert>
        <div className="text-center">
          <Link to="/orders" className="btn btn-primary">
            <FaArrowLeft className="me-1" />
            Back to Orders
          </Link>
        </div>
      </Container>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);

  return (
    <Container className="py-4">
      <div className="mb-3">
        <Link to="/orders" className="btn btn-outline-secondary">
          <FaArrowLeft className="me-1" />
          Back to Orders
        </Link>
      </div>

      <Row>
        <Col lg={8}>
          {/* Order Status */}
          <Card className="mb-4">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Order #{order.id}</h5>
                {getStatusBadge(order.status)}
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Order Progress</span>
                  <span>{getProgressPercentage(order.status)}%</span>
                </div>
                <ProgressBar
                  now={getProgressPercentage(order.status)}
                  variant={getProgressVariant(order.status)}
                  style={{ height: '8px' }}
                />
              </div>

              <Row className="text-center">
                <Col>
                  <small className="text-muted">Order Date</small>
                  <div>{formatDate(order.createdAt)}</div>
                </Col>
                <Col>
                  <small className="text-muted">Estimated Delivery</small>
                  <div>{getEstimatedDelivery(order)}</div>
                </Col>
                {order.trackingNumber && (
                  <Col>
                    <small className="text-muted">Tracking Number</small>
                    <div><code>{order.trackingNumber}</code></div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>

          {/* Tracking Timeline */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Tracking Timeline</h5>
            </Card.Header>
            <Card.Body>
              <div className="tracking-timeline">
                {trackingSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isUpcoming = index > currentStepIndex;

                  return (
                    <div key={step.status} className="d-flex mb-4">
                      <div className="flex-shrink-0 me-3">
                        <div
                          className={`rounded-circle d-flex align-items-center justify-content-center ${
                            isCompleted
                              ? 'bg-success text-white'
                              : isCurrent
                              ? 'bg-primary text-white'
                              : 'bg-light text-muted'
                          }`}
                          style={{ width: '40px', height: '40px' }}
                        >
                          {step.icon}
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div
                            className={`ms-3 ${
                              isCompleted ? 'bg-success' : 'bg-light'
                            }`}
                            style={{ width: '2px', height: '40px', marginTop: '8px' }}
                          />
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className={isCompleted || isCurrent ? 'text-dark' : 'text-muted'}>
                          {step.title}
                        </h6>
                        <p className={`mb-0 ${isCompleted || isCurrent ? 'text-dark' : 'text-muted'}`}>
                          {step.description}
                        </p>
                        {tracking?.events && tracking.events
                          .filter(event => event.status === step.status)
                          .map((event, eventIndex) => (
                            <small key={eventIndex} className="text-muted d-block">
                              {formatDate(event.timestamp)} - {event.description}
                            </small>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>

          {/* Order Items */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body>
              {order.items?.map((item, index) => (
                <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src={item.image || '/api/placeholder/80/80'}
                    alt={item.name}
                    className="me-3 rounded"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="text-muted mb-1">Quantity: {item.quantity}</p>
                    <p className="text-muted mb-0">${item.price} each</p>
                  </div>
                  <div className="text-end">
                    <h6>${(item.price * item.quantity).toFixed(2)}</h6>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Order Summary */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>${order.shipping?.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>${order.tax?.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>${order.total?.toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Shipping Address</h5>
              </Card.Header>
              <Card.Body>
                <address className="mb-0">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}
                  {order.shippingAddress.phone && (
                    <>
                      <br />
                      Phone: {order.shippingAddress.phone}
                    </>
                  )}
                </address>
              </Card.Body>
            </Card>
          )}

          {/* Payment Information */}
          {order.paymentInfo && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">Payment Information</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-1">
                  <strong>Method:</strong> {order.paymentInfo.method}
                </p>
                {order.paymentInfo.cardLast4 && (
                  <p className="mb-0">
                    <strong>Card:</strong> **** **** **** {order.paymentInfo.cardLast4}
                  </p>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderTracking;