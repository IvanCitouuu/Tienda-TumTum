import "./AdminPanel.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI, productosAPI, usuariosAPI, pedidosAPI } from "../../services/api";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    compras: 0,
    productos: 0,
    usuarios: 0,
    productosStockBajo: 0,
    inventarioActual: 0,
    nuevosUsuariosMes: 0,
    pedidosPendientes: 0
  });

  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productosStockBajo, setProductosStockBajo] = useState([]);
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: '',
    imagen: '',
    estado: 'ACTIVO'
  });

  const [editandoProducto, setEditandoProducto] = useState(null);

  useEffect(() => {
    const verificarAcceso = () => {
      const token = localStorage.getItem('token');
      const usuarioStorage = localStorage.getItem('usuarioActivo');
      
      console.log('Verificando acceso al admin...');
      console.log('Token:', token ? 'Presente' : 'Ausente');
      console.log('Usuario:', usuarioStorage);
      
      if (!token || !usuarioStorage) {
        console.log('No autenticado - redirigiendo a login');
        navigate('/login');
        return;
      }

      try {
        const usuarioData = JSON.parse(usuarioStorage);
        console.log('Usuario:', usuarioData);
        console.log('Rol:', usuarioData.rolUsuario);

        if (usuarioData.rolUsuario !== "ADMIN" && usuarioData.rolUsuario !== "VENDEDOR") {
          console.log('Sin permisos de admin - redirigiendo');
          setError('No tienes permisos para acceder al panel de administración');
          setTimeout(() => navigate('/productos'), 2000);
          return;
        }
        
        setUsuario(usuarioData);
        console.log('Acceso autorizado al admin');
        
      } catch (error) {
        console.error('Error parseando usuario:', error);
        navigate('/login');
      }
    };

    verificarAcceso();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const estadisticas = await dashboardAPI.obtenerEstadisticas();
      setStats(estadisticas);
      const todosProductos = await productosAPI.obtenerProductos();
      const stockBajo = todosProductos.filter(p => p.stock < 5);
      setProductosStockBajo(stockBajo);
    } catch (err) {
      setError('Error cargando datos del dashboard: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosAPI.obtenerPedidos();
      console.log('Pedidos cargados:', data);
      data.forEach(pedido => {
        console.log(`Pedido #${pedido.id}:`, {
          estado: pedido.estado,
          detalles: pedido.detalles?.length || 0,
          total: pedido.total
        });
      });
      
      const pedidosConProductos = data.map(pedido => ({
        ...pedido,
        productos: pedido.productos || [],
        detalles: pedido.detalles || []
      }));
      setPedidos(pedidosConProductos);
    } catch (err) {
      setError('Error cargando pedidos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await productosAPI.obtenerProductos();
      setProductos(data);
    } catch (err) {
      setError('Error cargando productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosAPI.obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError('Error cargando usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarEstadoPedido = async (id, estado) => {
    try {
      console.log(`Cambiando pedido #${id} a: ${estado}`);
      await pedidosAPI.actualizarEstadoPedido(id, estado);
      await loadPedidos();
      setError(`Pedido #${id} actualizado a ${estado}`);
    } catch (err) {
      console.error('Error actualizando pedido:', err);
      setError('Error actualizando pedido: ' + err.message);
    }
  };

  const handleCrearProducto = async (productoData) => {
    try {
      await productosAPI.crearProducto(productoData);
      await loadProductos();
      setVista('productos');
      setFormProducto({
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: '',
        stock: '',
        imagen: '',
        estado: 'ACTIVO'
      });
    } catch (err) {
      setError('Error creando producto: ' + err.message);
    }
  };

  const handleActualizarProducto = async (id, productoData) => {
    try {
      await productosAPI.actualizarProducto(id, productoData);
      await loadProductos();
      setEditandoProducto(null);
      setVista('productos');
    } catch (err) {
      setError('Error actualizando producto: ' + err.message);
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      await productosAPI.eliminarProducto(id);
      await loadProductos();
    } catch (err) {
      setError('Error eliminando producto: ' + err.message);
    }
  };

  const handleActualizarRolUsuario = async (id, rol) => {
    try {
      await usuariosAPI.actualizarRolUsuario(id, rol);
      await loadUsuarios();
    } catch (err) {
      setError('Error actualizando usuario: ' + err.message);
    }
  };

  const handleEliminarUsuario = async (id) => {
    try {
      if (!window.confirm(`¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.`)) {
        return;
      }
      setLoading(true);
      await usuariosAPI.eliminarUsuario(id);
      await loadUsuarios();
      setError('Usuario eliminado correctamente');
    } catch (err) {
      setError('Error eliminando usuario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarPedido = async (id) => {
    try {
      if (!window.confirm(`¿Estás seguro de que quieres eliminar el pedido #${id}? Esta acción no se puede deshacer.`)) {
        return;
      }
      setLoading(true);
      await pedidosAPI.eliminarPedido(id);
      await loadPedidos();
    } catch (err) {
      setError('Error eliminando pedido: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario && vista === 'dashboard') {
      loadDashboardData();
    } else if (usuario && vista === 'ordenes') {
      loadPedidos();
    } else if (usuario && vista === 'productos') {
      loadProductos();
    } else if (usuario && vista === 'usuarios') {
      loadUsuarios();
    }
  }, [vista, usuario]);

  const cambiarVista = (id) => {
    setVista(id);
    setError('');
    setEditandoProducto(null);
  };

  const handleFormChange = (field, value) => {
    setFormProducto(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    try {
      const productoData = {
        ...formProducto,
        precio: parseInt(formProducto.precio),
        stock: parseInt(formProducto.stock)
      };
      if (editandoProducto) {
        await handleActualizarProducto(editandoProducto.id, productoData);
      } else {
        await handleCrearProducto(productoData);
      }
    } catch (err) {
      setError('Error procesando producto: ' + err.message);
    }
  };

  const cargarProductoParaEditar = (producto) => {
    setEditandoProducto(producto);
    setFormProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      imagen: producto.imagen || '',
      estado: producto.estado
    });
    setVista('form-producto');
  };

  if (!usuario) {
    return (
      <div className="admin-layout">
        <div className="loading">Verificando permisos...</div>
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="logo">TumTum Admin</div>
        <div className="user-panel">
          <div className="user-info">
          </div>
        </div>

        <nav className="nav-section">
          <h3>Dashboard</h3>
          <ul>
            <li><button 
              className={vista === 'dashboard' ? 'active' : ''} 
              onClick={() => cambiarVista('dashboard')}
            >
              Dashboard
            </button></li>
          </ul>
        </nav>
        
        <nav className="nav-section">
          <h3>Gestión</h3>
          <ul>
            <li><button 
              className={vista === 'ordenes' ? 'active' : ''} 
              onClick={() => cambiarVista('ordenes')}
            >
              Pedidos
            </button></li>
            <li><button 
              className={vista === 'productos' ? 'active' : ''} 
              onClick={() => cambiarVista('productos')}
            >
              Productos
            </button></li>
            <li><button 
              className={vista === 'usuarios' ? 'active' : ''} 
              onClick={() => cambiarVista('usuarios')}
            >
              Usuarios
            </button></li>
          </ul>
        </nav>

        <nav className="nav-section">
          <h3>Acciones</h3>
          <ul>
            <li><button 
              onClick={() => {
                setEditandoProducto(null);
                setFormProducto({
                  nombre: '',
                  descripcion: '',
                  categoria: '',
                  precio: '',
                  stock: '',
                  imagen: '',
                  estado: 'ACTIVO'
                });
                setVista('form-producto');
              }}
            >
              Nuevo Producto
            </button></li>
            <li><button onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('usuarioActivo');
              window.location.href = '/login';
            }}>
              Cerrar Sesión
            </button></li>
          </ul>
        </nav>
      </aside>

      <main className="contenido">
        <div className="admin-header">
          <h1>Panel de Administración - TumTum Clothing</h1>
          <div className="user-welcome">
            Bienvenido, <strong>{usuario.nombreUsuario}</strong>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}
        
        {loading && (
          <div className="loading">Cargando...</div>
        )}

        {vista === 'dashboard' && (
          <section className="vista active">
            <div className="dashboard-header">
              <h2>Dashboard General</h2>
              <p>Resumen y estadísticas de la plataforma</p>
            </div>
            
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-content">
                  <h3>Total Productos</h3>
                  <div className="stat-number">{stats.productos}</div>
                  <div className="stat-subtitle">En inventario</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <h3>Usuarios Registrados</h3>
                  <div className="stat-number">{stats.usuarios}</div>
                  <div className="stat-subtitle">Clientes en plataforma</div>
                </div>
              </div>

              <div className="stat-card warning">
                <div className="stat-content">
                  <h3>Stock Bajo</h3>
                  <div className="stat-number">{stats.productosStockBajo}</div>
                  <div className="stat-subtitle">Necesitan reabastecimiento</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-content">
                  <h3>Pedidos Pendientes</h3>
                  <div className="stat-number">{stats.pedidosPendientes}</div>
                  <div className="stat-subtitle">Por procesar</div>
                </div>
              </div>
            </div>

            {productosStockBajo.length > 0 && (
              <div className="stock-bajo-section">
                <h3>Productos con Stock Crítico</h3>
                <div className="stock-bajo-lista">
                  {productosStockBajo.map(producto => (
                    <div key={producto.id} className="stock-bajo-item">
                      <div className="producto-info">
                        {producto.imagen && (
                          <img src={producto.imagen} alt={producto.nombre} className="producto-mini" />
                        )}
                        <div className="producto-details">
                          <span className="producto-nombre">{producto.nombre}</span>
                          <span className="producto-categoria">{producto.categoria}</span>
                        </div>
                      </div>
                      <div className={`stock-info ${producto.stock < 2 ? 'critico' : 'bajo'}`}>
                        <span className="stock-cantidad">{producto.stock} unidades</span>
                      </div>
                      <button 
                        className="btn-reabastecer"
                        onClick={() => cargarProductoParaEditar(producto)}
                      >
                        Reabastecer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {vista === 'ordenes' && (
          <section className="vista">
            <div className="section-header">
              <h2>Gestión de Pedidos</h2>
              <p>Administrar y seguir órdenes de compra</p>
            </div>
            
            {pedidos.length === 0 ? (
              <div className="no-data">No hay pedidos registrados</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Email</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map(pedido => (
                      <tr key={pedido.id}>
                        <td>#{pedido.id}</td>
                        <td>{pedido.nombreCliente}</td>
                        <td>{pedido.correoCliente}</td>
                        <td>{new Date(pedido.fechaCreacion).toLocaleDateString()}</td>
                        <td>${pedido.total?.toLocaleString()}</td>
                        <td>
                          <select 
                            value={pedido.estado || 'PENDIENTE'}
                            onChange={(e) => handleActualizarEstadoPedido(pedido.id, e.target.value)}
                            className={`status-select ${pedido.estado?.toLowerCase()}`}
                          >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="ENVIADO">Enviado</option>
                            <option value="ENTREGADO">Entregado</option>
                            <option value="CANCELADO">Cancelado</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => handleEliminarPedido(pedido.id)}
                            disabled={loading}
                          >
                            {loading ? '...' : 'Eliminar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {vista === 'productos' && (
          <section className="vista">
            <div className="section-header">
              <h2>Gestión de Productos</h2>
              <p>Administrar inventario de productos</p>
            </div>
            
            <div className="section-actions">
              <button 
                className="btn-primary"
                onClick={() => {
                  setEditandoProducto(null);
                  setFormProducto({
                    nombre: '',
                    descripcion: '',
                    categoria: '',
                    precio: '',
                    stock: '',
                    imagen: '',
                    estado: 'ACTIVO'
                  });
                  setVista('form-producto');
                }}
              >
                Agregar Producto
              </button>
            </div>
            
            {productos.length === 0 ? (
              <div className="no-data">No hay productos registrados</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(producto => (
                      <tr key={producto.id}>
                        <td>#{producto.id}</td>
                        <td>
                          <div className="product-info">
                            {producto.imagen && (
                              <img src={producto.imagen} alt={producto.nombre} className="product-thumb" />
                            )}
                            <span>{producto.nombre}</span>
                          </div>
                        </td>
                        <td>{producto.categoria}</td>
                        <td>${producto.precio?.toLocaleString()}</td>
                        <td className={producto.stock < 5 ? 'stock-low' : 'stock-ok'}>
                          {producto.stock}
                          {producto.stock < 5 && <span className="stock-warning">!</span>}
                        </td>
                        <td>
                          <span className={`estado ${producto.estado?.toLowerCase()}`}>
                            {producto.estado}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-edit"
                              onClick={() => cargarProductoParaEditar(producto)}
                            >
                              Editar
                            </button>
                            <button 
                              className="btn-delete"
                              onClick={() => {
                                if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                                  handleEliminarProducto(producto.id);
                                }
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {(vista === 'form-producto') && (
          <section className="vista">
            <div className="section-header">
              <h2>{editandoProducto ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
              <p>{editandoProducto ? 'Modificar información del producto' : 'Agregar un nuevo producto al inventario'}</p>
            </div>
            
            <form onSubmit={handleSubmitProducto} className="product-form">
              <div className="form-group">
                <label>Nombre del Producto:</label>
                <input 
                  type="text" 
                  value={formProducto.nombre}
                  onChange={(e) => handleFormChange('nombre', e.target.value)}
                  required 
                  placeholder="Ej: Camiseta Básica"
                />
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea 
                  value={formProducto.descripcion}
                  onChange={(e) => handleFormChange('descripcion', e.target.value)}
                  required
                  placeholder="Descripción detallada del producto"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Categoría:</label>
                <input 
                  type="text" 
                  value={formProducto.categoria}
                  onChange={(e) => handleFormChange('categoria', e.target.value)}
                  required 
                  placeholder="Ej: Ropa, Accesorios, Calzado"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio ($):</label>
                  <input 
                    type="number" 
                    value={formProducto.precio}
                    onChange={(e) => handleFormChange('precio', e.target.value)}
                    required
                    min="0"
                    step="100"
                  />
                </div>

                <div className="form-group">
                  <label>Stock:</label>
                  <input 
                    type="number" 
                    value={formProducto.stock}
                    onChange={(e) => handleFormChange('stock', e.target.value)}
                    required 
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de Imagen:</label>
                <input 
                  type="url" 
                  value={formProducto.imagen}
                  onChange={(e) => handleFormChange('imagen', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="form-group">
                <label>Estado:</label>
                <select 
                  value={formProducto.estado}
                  onChange={(e) => handleFormChange('estado', e.target.value)}
                >
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editandoProducto ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setVista('productos')}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {vista === 'usuarios' && (
          <section className="vista">
            <div className="section-header">
              <h2>Gestión de Usuarios</h2>
              <p>Administrar cuentas de usuarios</p>
            </div>
            
            {usuarios.length === 0 ? (
              <div className="no-data">No hay usuarios registrados</div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(usuarioItem => (
                      <tr key={usuarioItem.id}>
                        <td>#{usuarioItem.id}</td>
                        <td>{usuarioItem.nombre} {usuarioItem.apellidos}</td>
                        <td>{usuarioItem.email}</td>
                        <td>
                          <select 
                            value={usuarioItem.rol || 'USER'}
                            onChange={(e) => handleActualizarRolUsuario(usuarioItem.id, e.target.value)}
                            className="role-select"
                          >
                            <option value="USER">Usuario</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="VENDEDOR">Vendedor</option>
                          </select>
                        </td>
                        <td>
                          <span className={`estado ${usuarioItem.estado?.toLowerCase()}`}>
                            {usuarioItem.estado}
                          </span>
                        </td>
                        <td>{new Date(usuarioItem.fechaCreacion).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-delete"
                              onClick={() => handleEliminarUsuario(usuarioItem.id)}
                              disabled={loading}
                              title="Eliminar usuario"
                            >
                              {loading ? '...' : 'Eliminar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}