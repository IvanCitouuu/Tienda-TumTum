import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import './Perfil.css';

export default function Perfil() {
  const [usuario, setUsuario] = useState({
    run: '',
    nombreUsuario: '',
    apellidos: '',
    correoUsuario: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: ''
  });
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const cargarUsuario = () => {
      try {
        const usuarioStorage = localStorage.getItem('usuarioActivo');
        if (!usuarioStorage) {
          navigate('/login');
          return;
        }
        const usuarioData = JSON.parse(usuarioStorage);
        setUsuario({
          run: usuarioData.rutUsuario || usuarioData.run || 'No especificado',
          nombreUsuario: usuarioData.nombreUsuario || 'No especificado',
          apellidos: usuarioData.apellidosUsuario || usuarioData.apellidos || 'No especificado',
          correoUsuario: usuarioData.correoUsuario || 'No especificado',
          fechaNacimiento: usuarioData.nacimientoUsuario || usuarioData.fechaNacimiento || 'No especificado',
          region: usuarioData.regionUsuario || usuarioData.region || 'No especificado',
          comuna: usuarioData.comunaUsuario || usuarioData.comuna || 'No especificado',
          direccion: usuarioData.direccionUsuario || usuarioData.direccion || 'No especificado'
        });
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        navigate('/login');
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, [navigate]);

  const handleEditar = () => {
    setEditando(true);
  };

  const handleGuardar = async () => {
    try {
      setGuardando(true);
      const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
      const datosActualizados = {
        rutUsuario: usuario.run,
        nombreUsuario: usuario.nombreUsuario,
        apellidosUsuario: usuario.apellidos,
        correoUsuario: usuario.correoUsuario,
        nacimientoUsuario: usuario.fechaNacimiento,
        regionUsuario: usuario.region,
        comunaUsuario: usuario.comuna,
        direccionUsuario: usuario.direccion,
        contraseniaUsuario: usuarioActivo.contraseniaUsuario,
        rolUsuario: "CLIENTE"
      };
      const headers = {
        'Content-Type': 'application/json',
      };

      const token = usuarioActivo?.token || localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:8080/tumtum/usuarios/actualizar', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(datosActualizados)
      });

      if (response.ok) {
        const usuarioActualizado = {
          ...usuarioActivo,
          ...datosActualizados
        };
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado));
        setEditando(false);
        alert('Perfil actualizado correctamente en la base de datos');
      } else if (response.status === 401) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('usuarioActivo');
        navigate('/login');
      } else if (response.status === 409) {
        alert('El correo electrónico ya está en uso por otro usuario');
      } else {
        throw new Error('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al conectar con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    const usuarioOriginal = JSON.parse(localStorage.getItem('usuarioActivo'));
    setUsuario({
      run: usuarioOriginal.rutUsuario || usuarioOriginal.run || 'No especificado',
      nombreUsuario: usuarioOriginal.nombreUsuario || 'No especificado',
      apellidos: usuarioOriginal.apellidosUsuario || usuarioOriginal.apellidos || 'No especificado',
      correoUsuario: usuarioOriginal.correoUsuario || 'No especificado',
      fechaNacimiento: usuarioOriginal.nacimientoUsuario || usuarioOriginal.fechaNacimiento || 'No especificado',
      region: usuarioOriginal.regionUsuario || usuarioOriginal.region || 'No especificado',
      comuna: usuarioOriginal.comunaUsuario || usuarioOriginal.comuna || 'No especificado',
      direccion: usuarioOriginal.direccionUsuario || usuarioOriginal.direccion || 'No especificado'
    });
    setEditando(false);
  };

  const handleInputChange = (campo, valor) => {
    setUsuario(prev => ({
      ...prev,
      [campo]: valor
    }));
  };
  if (cargando) {
    return (
      <>
        <Navbar />
        <div className="cargando">Cargando perfil...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="perfil-page">
        <div className="perfil-container">
          <div className="perfil-header">
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal</p>
          </div>
          <div className="perfil-content">
            <div className="perfil-info">
              <div className="info-section">
                <h2>Información Personal</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <label>RUN</label>
                    <span className="campo-no-editable">{usuario.run}</span>
                  </div>
                  <div className="info-item">
                    <label>Nombre</label>
                    <span className="campo-no-editable">{usuario.nombreUsuario}</span>
                  </div>
                  <div className="info-item">
                    <label>Apellidos</label>
                    <span className="campo-no-editable">{usuario.apellidos}</span>
                  </div>
                  <div className="info-item">
                    <label>Correo Electrónico</label>
                    {editando ? (
                      <input 
                        type="email" 
                        value={usuario.correoUsuario} 
                        onChange={(e) => handleInputChange('correoUsuario', e.target.value)}
                        placeholder="Ingresa tu correo"
                      />
                    ) : (
                      <span>{usuario.correoUsuario}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Fecha de Nacimiento</label>
                    {editando ? (
                      <input 
                        type="date" 
                        value={usuario.fechaNacimiento} 
                        onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      />
                    ) : (
                      <span>{usuario.fechaNacimiento}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Región</label>
                    {editando ? (
                      <input 
                        type="text" 
                        value={usuario.region} 
                        onChange={(e) => handleInputChange('region', e.target.value)}
                        placeholder="Ingresa tu región"
                      />
                    ) : (
                      <span>{usuario.region}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Comuna</label>
                    {editando ? (
                      <input 
                        type="text" 
                        value={usuario.comuna} 
                        onChange={(e) => handleInputChange('comuna', e.target.value)}
                        placeholder="Ingresa tu comuna"
                      />
                    ) : (
                      <span>{usuario.comuna}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Dirección</label>
                    {editando ? (
                      <input 
                        type="text" 
                        value={usuario.direccion} 
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        placeholder="Ingresa tu dirección"
                      />
                    ) : (
                      <span>{usuario.direccion}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="perfil-actions">
              {editando && (
                <div className="info-ayuda">
                  <p><strong>Nota:</strong> El RUN, nombre y apellidos no se pueden modificar por seguridad.</p>
                </div>
              )}
              {!editando ? (
                <button className="btn-editar" onClick={handleEditar}>
                  Editar Perfil
                </button>
              ) : (
                <div className="acciones-edicion">
                  <button 
                    className="btn-guardar" 
                    onClick={handleGuardar}
                    disabled={guardando}
                  >
                    {guardando ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button 
                    className="btn-cancelar" 
                    onClick={handleCancelar}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}