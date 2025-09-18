import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { productsAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'name'
  });

  const { isAdmin } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const response = await productsAPI.getAllProducts(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) newParams.set(key, val);
    });
    setSearchParams(newParams);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name'
    });
    setSearchParams({});
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading products...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Products</h1>
        {isAdmin() && (
          <Button as={Link} to="/admin/add-product" variant="success">
            Add New Product
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search products..."
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Min Price</Form.Label>
                <Form.Control
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="0"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Max Price</Form.Label>
                <Form.Control
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="1000"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="createdAt">Newest</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={clearFilters}>
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {products.length === 0 ? (
        <Alert variant="info" className="text-center">
          No products found. {isAdmin() && <Link to="/admin/add-product">Add the first product</Link>}
        </Alert>
      ) : (
        <Row>
          {products.map(product => (
            <Col key={product.id} md={6} lg={4} className="mb-4">
              <Card className="product-card h-100">
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
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Badge>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      as={Link}
                      to={`/product/${product.id}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      <FaEye /> View
                    </Button>
                    {product.stock > 0 && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="flex-grow-1"
                      >
                        Add to Cart
                      </Button>
                    )}
                    {isAdmin() && (
                      <>
                        <Button
                          as={Link}
                          to={`/admin/edit-product/${product.id}`}
                          variant="outline-warning"
                          size="sm"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <FaTrash />
                        </Button>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Products;