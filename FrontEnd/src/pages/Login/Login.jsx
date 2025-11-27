import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { usuariosAPI } from '/src/services/api.js';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    clave: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMensaje(''); 
  };

  const iniciarSesion = async (e) => {
    e?.preventDefault(); 
    if (!formData.email || !formData.clave) {
      setMensaje("Por favor completa todos los campos");
      return;
    }
    const dominioValido = /@duoc\.cl$|@profesor\.duoc\.cl$|@gmail\.com$/;
    if (!dominioValido.test(formData.email)) {
      setMensaje("Correo no permitido. Use @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return;
    }
    setIsLoading(true);
    try {
      const resultado = await usuariosAPI.login({
        email: formData.email,
        password: formData.clave
      });

      if (resultado.token && resultado.usuario) {
        localStorage.setItem("usuarioActivo", JSON.stringify(resultado.usuario));
        localStorage.setItem("token", resultado.token);
        setMensaje(`¡Bienvenido ${resultado.usuario.nombreUsuario || resultado.usuario.correoUsuario}!`);
        setTimeout(() => {
          if (resultado.usuario.rolUsuario === "ADMIN" || resultado.usuario.rolUsuario === "VENDEDOR") {
            navigate("/admin");
          } else {
            navigate("/productos");
          }
        }, 1000);
      } else {
        localStorage.setItem("usuarioActivo", JSON.stringify(resultado));
        setMensaje(`¡Bienvenido ${resultado.nombreUsuario || resultado.correoUsuario}!`);
        setTimeout(() => navigate("/productos"), 1000);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setMensaje(err.message || "Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h2>Iniciar sesión</h2>
            <p>Accede a tu cuenta de TumTum Ropa</p>
          </div>         
          <form onSubmit={iniciarSesion}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu.email@duoc.cl"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="clave">Contraseña</label>
              <input
                type="password"
                id="clave"
                name="clave"
                placeholder="Ingresa tu contraseña"
                value={formData.clave}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            {mensaje && (
              <div className={`mensaje ${mensaje.includes('¡Bienvenido') ? 'mensaje-exito' : 'mensaje-error'}`}>
                {mensaje}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-login"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </form>
          <div className="login-links">
            <p>
              ¿No tienes una cuenta? <a href="/registro">Regístrate aquí</a>
            </p>
            <p><a href="#">¿Olvidaste tu contraseña?</a></p>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}