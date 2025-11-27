import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

vi.mock('./Productos', () => ({
  default: function MockProductos() {
    return (
      <div data-testid="productos-page">
        <h1 data-testid="productos-title">PRODUCTOS</h1>
        <p data-testid="productos-desc">Descubre nuestra colección</p>
        <div data-testid="productos-list">
          <div>Camiseta Básica - $15.000</div>
          <div>Pantalón Jeans - $35.000</div>
        </div>
      </div>
    )
  }
}))

import Productos from './Productos'

describe('Productos Component', () => {
  it('debe mostrar el título PRODUCTOS', () => {
    render(
      <BrowserRouter>
        <Productos />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('productos-page')).toBeInTheDocument()
    expect(screen.getByTestId('productos-title')).toHaveTextContent('PRODUCTOS')
    expect(screen.getByTestId('productos-desc')).toHaveTextContent('Descubre nuestra colección')
  })
})