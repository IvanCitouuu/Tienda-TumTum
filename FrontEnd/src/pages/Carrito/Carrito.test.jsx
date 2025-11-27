import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider } from '../../context/CartContext';
import Carrito from './Carrito';
import { beforeEach, describe, it, expect, vi } from 'vitest';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const mockFetch = vi.fn();

vi.mock('../../components/Navbar/Navbar.jsx', () => ({
  default: function MockNavbar() {
    return <div data-testid="mock-navbar">Navbar</div>;
  }
}));

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  Object.defineProperty(window, 'fetch', { value: mockFetch });
  mockLocalStorage.getItem.mockImplementation((key) => {
    if (key === 'usuarioActivo') {
      return JSON.stringify({
        correoUsuario: 'test@test.com',
        nombreUsuario: 'Usuario Test'
      });
    }
    return null;
  });
});

const RenderCarrito = () => (
  <CartProvider>
    <Carrito />
  </CartProvider>
);

describe('Carrito - Pruebas del Componente', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'usuarioActivo') {
        return JSON.stringify({
          correoUsuario: 'test@test.com',
          nombreUsuario: 'Usuario Test'
        });
      }
      return null;
    });
    mockFetch.mockReset();
  });

  it('debe mostrar mensaje de carrito vacío cuando no hay productos', () => {
    render(<RenderCarrito />);

    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    expect(screen.getByText('Seguir comprando')).toBeInTheDocument();
  });

  it('debe mostrar productos cuando el carrito tiene items', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'carrito') {
        return JSON.stringify([
          {
            id: '1',
            nombre: 'Camiseta Test',
            precio: 15000,
            imagen: 'camiseta.jpg',
            talla: 'M',
            cantidad: 2
          }
        ]);
      }
      if (key === 'usuarioActivo') {
        return JSON.stringify({
          correoUsuario: 'test@test.com',
          nombreUsuario: 'Usuario Test'
        });
      }
      return null;
    });
    render(<RenderCarrito />);
    expect(screen.getByText('Camiseta Test')).toBeInTheDocument();
    expect(screen.getByText('Talla: M')).toBeInTheDocument();
    expect(screen.getByText('$15.000')).toBeInTheDocument();
  });

  it('debe manejar usuario no logueado correctamente', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'carrito') {
        return JSON.stringify([
          {
            id: '1',
            nombre: 'Camiseta Test',
            precio: 15000,
            imagen: 'camiseta.jpg',
            talla: 'M',
            cantidad: 1
          }
        ]);
      }
      return null;
    });
    render(<RenderCarrito />);
    expect(screen.getByText('Camiseta Test')).toBeInTheDocument();
  });

  it('debe manejar error en finalizar compra', async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'carrito') {
        return JSON.stringify([
          {
            id: '1',
            nombre: 'Camiseta Test',
            precio: 15000,
            imagen: 'camiseta.jpg',
            talla: 'M',
            cantidad: 1
          }
        ]);
      }
      if (key === 'usuarioActivo') {
        return JSON.stringify({
          correoUsuario: 'test@test.com',
          nombreUsuario: 'Usuario Test'
        });
      }
      return null;
    });
    mockFetch.mockRejectedValueOnce(new Error('Error de servidor'));
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<RenderCarrito />);
    const finalizarButton = screen.getByText('Finalizar compra');
    fireEvent.click(finalizarButton);
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringMatching(/(No se pudo registrar el pedido|Sesión expirada)/)
      );
    });
    alertMock.mockRestore();
  });

  it('debe decrementar cantidad y eliminar cuando llega a 0', () => { 
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'carrito') {
        return JSON.stringify([
          {
            id: '1',
            nombre: 'Camiseta Test',
            precio: 15000,
            imagen: 'camiseta.jpg',
            talla: 'M',
            cantidad: 1
          }
        ]);
      }
      if (key === 'usuarioActivo') {
        return JSON.stringify({
          correoUsuario: 'test@test.com',
          nombreUsuario: 'Usuario Test'
        });
      }
      return null;
    });
    render(<RenderCarrito />);
    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('debe incrementar cantidad cuando se hace click en +', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'carrito') {
        return JSON.stringify([
          {
            id: '1',
            nombre: 'Camiseta Test',
            precio: 15000,
            imagen: 'camiseta.jpg',
            talla: 'M',
            cantidad: 1
          }
        ]);
      }
      if (key === 'usuarioActivo') {
        return JSON.stringify({
          correoUsuario: 'test@test.com',
          nombreUsuario: 'Usuario Test'
        });
      }
      return null;
    });

    render(<RenderCarrito />);
    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('debe procesar compra correctamente', async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'carrito') {
        return JSON.stringify([
          {
            id: '1',
            nombre: 'Camiseta Test',
            precio: 15000,
            imagen: 'camiseta.jpg',
            talla: 'M',
            cantidad: 1
          }
        ]);
      }
      if (key === 'usuarioActivo') {
        return JSON.stringify({
          correoUsuario: 'test@test.com',
          nombreUsuario: 'Usuario Test'
        });
      }
      if (key === 'token') {
        return 'mock-token-123';
      }
      return null;
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: "Pedido registrado correctamente" })
    });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<RenderCarrito />);
    const finalizarButton = screen.getByText('Finalizar compra');
    fireEvent.click(finalizarButton);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/tumtum/pedidos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer mock-token-123'
        },
        body: expect.any(String)
      });
    });
    expect(alertMock).toHaveBeenCalledWith(
      expect.stringMatching(/(Gracias por tu compra|Pedido registrado)/)
    );
    alertMock.mockRestore();
  });
});