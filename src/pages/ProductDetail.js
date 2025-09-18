import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const { isAdmin } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productsAPI.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setError('Product not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.deleteProduct(id);
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleAddToCart = async () => {
    if (!product || quantity <= 0) return;

    setAddingToCart(true);
    await addToCart(product, quantity);
    setAddingToCart(false);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading product...</p>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error || 'Product not found'}
        </Alert>
        <div className="text-center">
          <Button as={Link} to="/products" variant="primary">
            <FaArrowLeft className="me-1" />
            Back to Products
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-3">
        <Button as={Link} to="/products" variant="outline-secondary">
          <FaArrowLeft className="me-1" />
          Back to Products
        </Button>
      </div>

      <Row>
        <Col lg={6}>
          <Card>
            <Card.Img
              variant="top"
              src={product.image || '/api/placeholder/500/400'}
              alt={product.name}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </Card>
        </Col>

        <Col lg={6}>
          <div className="h-100 d-flex flex-column">
            <div className="mb-3">
              <h1>{product.name}</h1>
              <p className="text-muted">{product.category}</p>
            </div>

            <div className="mb-3">
              <h2 className="text-primary">${product.price}</h2>
              <Badge bg={product.stock > 0 ? 'success' : 'danger'} className="fs-6">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>

            <div className="mb-4">
              <h5>Description</h5>
              <p>{product.description}</p>
            </div>

            {product.specifications && (
              <div className="mb-4">
                <h5>Specifications</h5>
                <ul>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.stock > 0 && (
              <div className="mb-4">
                <h6>Quantity</h6>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </Button>
                  <Form.Control
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                    style={{ width: '80px' }}
                    className="text-center"
                  />
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus />
                  </Button>
                </div>
                <small className="text-muted">
                  Maximum {product.stock} items available
                </small>
              </div>
            )}

            <div className="mt-auto">
              <div className="d-flex gap-2 mb-3">
                {product.stock > 0 && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-grow-1"
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                )}

                {isAdmin() && (
                  <>
                    <Button
                      as={Link}
                      to={`/admin/edit-product/${product.id}`}
                      variant="warning"
                      size="lg"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={handleDeleteProduct}
                    >
                      <FaTrash />
                    </Button>
                  </>
                )}
              </div>

              {product.stock === 0 && (
                <Alert variant="warning">
                  This product is currently out of stock.
                </Alert>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* Additional Product Information */}
      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Product Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
                  <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
                  <p><strong>Weight:</strong> {product.weight || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Dimensions:</strong> {product.dimensions || 'N/A'}</p>
                  <p><strong>Material:</strong> {product.material || 'N/A'}</p>
                  <p><strong>Warranty:</strong> {product.warranty || 'N/A'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;