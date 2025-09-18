import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4">
            <h5 className="text-white mb-3">E-Commerce Store</h5>
            <p className="text-light">
              Your trusted online shopping destination for quality products
              at unbeatable prices. We're committed to providing excellent
              customer service and fast, secure delivery.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-light">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-light">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-light">
                <FaLinkedin size={20} />
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-light text-decoration-none">
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-light text-decoration-none">
                  Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/orders" className="text-light text-decoration-none">
                  My Orders
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-white mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/products?category=Electronics"
                  className="text-light text-decoration-none"
                >
                  Electronics
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=Clothing"
                  className="text-light text-decoration-none"
                >
                  Clothing
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=Books"
                  className="text-light text-decoration-none"
                >
                  Books
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/products?category=Home"
                  className="text-light text-decoration-none"
                >
                  Home & Garden
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-white mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Shipping Info
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Returns
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-white mb-3">Legal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Terms of Service
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Cookie Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">
                  Refund Policy
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="mt-4 pt-4 border-top border-secondary">
          <Col lg={6} className="mb-3">
            <div className="text-light">
              <h6 className="mb-2">Contact Information</h6>
              <p className="mb-1">
                <FaMapMarkerAlt className="me-2" />
                123 E-Commerce Street, Shopping City, SC 12345
              </p>
              <p className="mb-1">
                <FaPhone className="me-2" />
                +1 (555) 123-4567
              </p>
              <p className="mb-0">
                <FaEnvelope className="me-2" />
                support@ecommerce-store.com
              </p>
            </div>
          </Col>

          <Col lg={6} className="mb-3">
            <div className="text-light">
              <h6 className="mb-2">Newsletter</h6>
              <p className="mb-2">Subscribe to get updates on new products and offers</p>
              <div className="d-flex">
                <input
                  type="email"
                  className="form-control me-2"
                  placeholder="Enter your email"
                />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mt-3 pt-3 border-top border-secondary">
          <Col className="text-center">
            <p className="text-light mb-0">
              &copy; 2024 E-Commerce Store. All rights reserved. |
              <span className="text-muted"> Built with React & Bootstrap</span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;