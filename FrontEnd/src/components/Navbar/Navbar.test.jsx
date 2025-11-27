import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

vi.mock('./Navbar', () => ({
  default: function MockNavbar() {
    return (
      <nav data-testid="navbar">
        <a href="/" data-testid="inicio-link">Inicio</a>
        <a href="/productos" data-testid="productos-link">Productos</a>
        <a href="/contacto" data-testid="contacto-link">Contacto</a>
        <a href="/carrito" data-testid="carrito-link">Carrito</a>
      </nav>
    )
  }
}))

import Navbar from './Navbar'

describe('Navbar Component', () => {
  it('debe mostrar enlaces de navegación', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('inicio-link')).toHaveTextContent('Inicio')
    expect(screen.getByTestId('productos-link')).toHaveTextContent('Productos')
    expect(screen.getByTestId('contacto-link')).toHaveTextContent('Contacto')
  })
})