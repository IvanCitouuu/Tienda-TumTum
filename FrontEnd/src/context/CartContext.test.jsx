import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import { beforeEach, beforeAll, describe, it, expect, vi } from 'vitest';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

const TestComponent = () => {
  const { 
    items, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice,
    getTotalItems,
    formatCLP 
  } = useCart();

  return (
    <div>
      <div data-testid="items-count">{items.length}</div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="total-price">{getTotalPrice()}</div>
      <div data-testid="formatted-price">{formatCLP(1000)}</div>
      <button 
        onClick={() => addToCart({ 
          id: '1', 
          nombre: 'Camiseta Test', 
          precio: 10000, 
          imagen: 'test.jpg',
          talla: 'M' 
        })}
        data-testid="add-button"
      >
        Agregar producto
      </button>
      <button 
        onClick={() => removeFromCart('1', 'M')}
        data-testid="remove-button"
      >
        Remover producto
      </button>
      <button 
        onClick={() => updateQuantity('1', 'M', 5)}
        data-testid="update-button"
      >
        Actualizar cantidad
      </button>
      <button 
        onClick={clearCart}
        data-testid="clear-button"
      >
        Vaciar carrito
      </button>
    </div>
  );
};

describe('CartContext - Pruebas del Carrito', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('debe agregar un producto al carrito correctamente', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByTestId('add-button'));

    expect(screen.getByTestId('items-count').textContent).toBe('1');
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    expect(screen.getByTestId('total-price').textContent).toBe('10000');
  });

  it('debe incrementar la cantidad cuando se agrega un producto existente', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-button'));
    fireEvent.click(screen.getByTestId('add-button'))
    expect(screen.getByTestId('items-count').textContent).toBe('1');
    expect(screen.getByTestId('total-items').textContent).toBe('2');
    expect(screen.getByTestId('total-price').textContent).toBe('20000');
  });

  it('debe remover un producto específico del carrito', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    fireEvent.click(screen.getByTestId('add-button'));
    fireEvent.click(screen.getByTestId('remove-button'));
    expect(screen.getByTestId('items-count').textContent).toBe('0');
    expect(screen.getByTestId('total-price').textContent).toBe('0');
  });

  it('debe formatear precios en pesos chilenos', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(screen.getByTestId('formatted-price').textContent).toBe('$1.000');
  });
});