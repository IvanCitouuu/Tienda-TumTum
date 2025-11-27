/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const savedCart = localStorage.getItem('carrito');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.log('Error cargando carrito:', error);
        localStorage.removeItem('carrito');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);
  const addToCart = (product) => {
    if (!product || !product.id) {
      console.error('Producto inválido:', product);
      return;
    }
    const productId = String(product.id);
    const productTalla = product.talla || 'S';
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === productId && item.talla === productTalla
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          cantidad: updatedItems[existingItemIndex].cantidad + (product.cantidad || 1)
        };
        return updatedItems;
      } else {
        const newItem = {
          id: productId,
          nombre: product.nombre || 'Producto',
          precio: product.precio || 0,
          imagen: product.imagen || '',
          talla: productTalla,
          cantidad: product.cantidad || 1
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (productId, talla = 'S') => {
    setItems(prevItems => 
      prevItems.filter(item => !(item.id === productId && item.talla === talla))
    );
  };

  const updateQuantity = (productId, talla = 'S', newCantidad) => {
    if (newCantidad < 1) {
      removeFromCart(productId, talla);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId && item.talla === talla
          ? { ...item, cantidad: newCantidad }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
  console.log('Calculando total con items:', items);
  return items.reduce((total, item) => {
    const itemTotal = item.precio * item.cantidad;
    console.log(`   ${item.nombre}: ${item.precio} x ${item.cantidad} = ${itemTotal}`);
    return total + itemTotal;
  }, 0);
};

  const formatCLP = (amount) => {
    if (typeof amount !== 'number') return '$0';
    return `$${amount.toLocaleString('es-CL')}`;
  };
  
  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    formatCLP
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};