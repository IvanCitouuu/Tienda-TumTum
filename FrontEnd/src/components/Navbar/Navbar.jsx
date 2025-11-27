import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [navAbierto, setNavAbierto] = useState(false);
  const menuRef = useRef(null);
  const navRef = useRef(null);
  const hamburguesaRef = useRef(null);
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      } 
      if (navAbierto && 
          navRef.current && 
          !navRef.current.contains(event.target) &&
          hamburguesaRef.current && 
          !hamburguesaRef.current.contains(event.target)) {
        setNavAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navAbierto]);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const toggleNav = () => {
    setNavAbierto(!navAbierto);
  };

  const cerrarSesion = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('usuarioActivo');
      setMenuAbierto(false);
      setNavAbierto(false);
      navigate('/');
      window.location.reload();
    }
  };

  const cerrarMenus = () => {
    setMenuAbierto(false);
    setNavAbierto(false);
  };

  return (
    <header className="navbar-grid">
      <button 
        className={`menu-hamburguesa ${navAbierto ? 'activo' : ''}`}
        onClick={toggleNav}
        aria-label="Abrir menú de navegación"
        ref={hamburguesaRef}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`menu ${navAbierto ? 'activo' : ''}`} ref={navRef}>
        <ul>
          <li><Link to="/" onClick={cerrarMenus}>Inicio</Link></li>
          <li><Link to="/productos" onClick={cerrarMenus}>Productos</Link></li>
          <li><Link to="/contacto" onClick={cerrarMenus}>Contacto</Link></li>
        </ul>
      </nav>
      <div className="navbar__centro">
        <Link to="/" className="logo" onClick={cerrarMenus}>
          <img src="/img/logo.png" alt="Logo TumTum" />
        </Link>
      </div>
      <div className="acciones">
        {usuario ? (
          <div className="perfil-dropdown" ref={menuRef}>
            <div className="perfil-trigger" onClick={toggleMenu}>
              <div className="avatar-usuario">
                <img 
                  src="/img/Inicio.jpg"
                  alt="Usuario" 
                  className="avatar-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling?.remove();
                    const fallback = document.createElement('span');
                    fallback.className = 'avatar-fallback';
                    fallback.textContent = 'X';
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
              </div>
              <span className="saludo-usuario ocultar-en-mobile">
                Hola, {usuario.nombreUsuario || usuario.correoUsuario.split('@')[0]}
              </span>
              <span className={`menu-flecha ${menuAbierto ? 'abierto' : ''}`}>
                ▼
              </span>
            </div>
            <div className={`menu-perfil ${menuAbierto ? 'activo' : ''}`}>
              <Link to="/perfil" onClick={cerrarMenus}>Mi Perfil</Link>
              <Link to="/pedidos" onClick={cerrarMenus}>Mis Pedidos</Link>
              {usuario.rol === 'ADMIN' && (
                <Link to="/admin" onClick={cerrarMenus}>Panel Admin</Link>
              )}
              <button onClick={cerrarSesion} className="btn-cerrar-sesion">
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-link" onClick={cerrarMenus}>
            <img src="/img/Inicio.jpg" alt="Iniciar sesión" />
          </Link>
        )}
        
        <Link to="/carrito" className="carrito-link" onClick={cerrarMenus}>
          <img src="/img/Carro.jpg" alt="Carrito" />
          {getTotalItems() > 0 && (
            <span className="carrito-contador">{getTotalItems()}</span>
          )}
        </Link>
      </div>
    </header>
  );
}