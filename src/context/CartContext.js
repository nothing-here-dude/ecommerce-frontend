import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load cart from localStorage for guest users
      loadGuestCart();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    calculateCartTotals();
  }, [cartItems]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Fallback to localStorage if API fails
      loadGuestCart();
    } finally {
      setLoading(false);
    }
  };

  const loadGuestCart = () => {
    try {
      const savedCart = localStorage.getItem('guestCart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load guest cart:', error);
      setCartItems([]);
    }
  };

  const saveGuestCart = (items) => {
    try {
      localStorage.setItem('guestCart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save guest cart:', error);
    }
  };

  const calculateCartTotals = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartTotal(total);
    setItemCount(count);
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Add to server cart
        await cartAPI.addToCart(product.id, quantity);
        await fetchCart();
      } else {
        // Add to guest cart
        const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);
        let updatedItems;

        if (existingItemIndex >= 0) {
          updatedItems = cartItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem = {
            id: Date.now(), // Temporary ID for guest cart
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
          };
          updatedItems = [...cartItems, newItem];
        }

        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
      }

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);

      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      if (isAuthenticated) {
        await cartAPI.updateCartItem(itemId, quantity);
        await fetchCart();
      } else {
        const updatedItems = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update item quantity');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        await cartAPI.removeFromCart(itemId);
        await fetchCart();
      } else {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);
        saveGuestCart(updatedItems);
      }

      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        await cartAPI.clearCart();
      } else {
        localStorage.removeItem('guestCart');
      }

      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    loading,
    cartTotal,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};