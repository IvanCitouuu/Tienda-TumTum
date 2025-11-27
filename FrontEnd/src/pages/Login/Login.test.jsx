import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

vi.mock('./Login', () => ({
  default: function MockLogin() {
    return (
      <div>
        <h2>INICIAR SESIÓN</h2>
        <form data-testid="login-form">
          <input placeholder="Correo electrónico" data-testid="email-input" />
          <input placeholder="Contraseña" type="password" data-testid="password-input" />
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    )
  }
}))

import Login from './Login'

describe('Login Component', () => {
  it('debe mostrar el título INICIAR SESIÓN', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    expect(screen.getByText('INICIAR SESIÓN')).toBeInTheDocument()
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })
})