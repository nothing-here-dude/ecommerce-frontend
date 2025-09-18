import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Carousel, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaStar } from 'react-icons/fa';
import { productsAPI, categoriesAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAllProducts({ limit: 6 }),
        categoriesAPI.getAllCategories()
      ]);

      setFeaturedProducts(productsResponse.data);
      setCategories(categoriesResponse.data.slice(0, 8)); // Show max 8 categories
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Our Store
              </h1>
              <p className="lead mb-4">
                Discover amazing products at unbeatable prices. Shop with confidence
                and enjoy fast, secure delivery right to your door.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/products" variant="light" size="lg">
                  Shop Now
                </Button>
                <Button variant="outline-light" size="lg">
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <img
                  src="/api/placeholder/500/400"
                  alt="Hero"
                  className="img-fluid rounded"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Search Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center mb-4">
                <h2>Find What You're Looking For</h2>
                <p className="text-muted">Search through thousands of products</p>
              </div>

              <Form onSubmit={handleSearch} className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="lg"
                  className="me-2"
                />
                <Button type="submit" variant="primary" size="lg">
                  <FaSearch className="me-2" />
                  Search
                </Button>
              </Form>

              {/* Popular Searches */}
              <div className="text-center mt-3">
                <small className="text-muted">Popular searches: </small>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate('/products?search=electronics')}
                >
                  Electronics
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate('/products?search=clothing')}
                >
                  Clothing
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate('/products?search=books')}
                >
                  Books
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate('/products?search=home')}
                >
                  Home & Garden
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2>Shop by Category</h2>
            <p className="text-muted">Browse our wide range of product categories</p>
          </div>

          <Row>
            {categories.map((category, index) => (
              <Col key={category.id} md={3} sm={6} className="mb-4">
                <Card
                  className="h-100 category-card border-0 shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/products?category=${category.name}`)}
                >
                  <Card.Img
                    variant="top"
                    src={category.image || `/api/placeholder/200/150`}
                    alt={category.name}
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{category.name}</Card.Title>
                    <Card.Text className="text-muted small">
                      {category.description || 'Explore this category'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-4">
            <Button as={Link} to="/products" variant="outline-primary" size="lg">
              View All Categories
            </Button>
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2>Featured Products</h2>
            <p className="text-muted">Check out our most popular items</p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Row>
              {featuredProducts.map(product => (
                <Col key={product.id} lg={4} md={6} className="mb-4">
                  <Card className="h-100 product-card">
                    <Card.Img
                      variant="top"
                      src={product.image || '/api/placeholder/300/200'}
                      alt={product.name}
                      className="product-image"
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text className="text-muted small">
                        {product.category}
                      </Card.Text>
                      <Card.Text className="flex-grow-1">
                        {product.description?.substring(0, 100)}
                        {product.description?.length > 100 && '...'}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="text-primary mb-0">${product.price}</h5>
                        <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          as={Link}
                          to={`/product/${product.id}`}
                          variant="outline-primary"
                          size="sm"
                          className="flex-grow-1"
                        >
                          View Details
                        </Button>
                        {product.stock > 0 && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            <FaShoppingCart />
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-4">
            <Button as={Link} to="/products" variant="primary" size="lg">
              View All Products
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col md={4} className="mb-4">
              <div className="mb-3">
                <FaShoppingCart size={48} className="text-primary" />
              </div>
              <h5>Easy Shopping</h5>
              <p className="text-muted">
                Browse and shop with our user-friendly interface
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <div className="mb-3">
                <FaStar size={48} className="text-warning" />
              </div>
              <h5>Quality Products</h5>
              <p className="text-muted">
                We offer only the highest quality products from trusted brands
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <div className="mb-3">
                <FaShoppingCart size={48} className="text-success" />
              </div>
              <h5>Fast Delivery</h5>
              <p className="text-muted">
                Quick and secure delivery right to your doorstep
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;