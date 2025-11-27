import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { pedidosAPI } from '../../services/api.js';
import './Pedidos.css';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        console.log('Iniciando carga de pedidos...');
        const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
        console.log(' Usuario activo:', usuario);  
        if (!usuario) {
          console.log('No hay usuario, redirigiendo a login');
          navigate('/login');
          return;
        }
        const correoUsuario = usuario.correoUsuario || usuario.email || usuario.correo;
        console.log('Correo del usuario:', correoUsuario);
        if (!correoUsuario) {
          setError('No se pudo obtener el correo del usuario');
          setCargando(false);
          return;
        }
        console.log('Obteniendo pedidos del usuario...');
        const pedidosData = await pedidosAPI.obtenerPedidosPorUsuario(correoUsuario);
        console.log('Pedidos obtenidos:', pedidosData);
        setPedidos(pedidosData);
      } catch (error) {
        console.error('Error cargando pedidos:', error);
        setError('Error al cargar pedidos: ' + error.message);
      } finally {
        setCargando(false);
      }
    };
    cargarPedidos();
  }, [navigate]);

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no disponible';   
    try {
      if (typeof fechaString === 'object' && fechaString.year) {
        const fecha = new Date(fechaString.year, fechaString.monthValue - 1, fechaString.dayOfMonth);
        return fecha.toLocaleDateString('es-CL');
      }
      const fecha = new Date(fechaString);
      if (isNaN(fecha.getTime())) {
        return 'Fecha no disponible';
      }
      return fecha.toLocaleDateString('es-CL');
    } catch (error) {
      console.error('Error formateando fecha:', fechaString, error);
      return 'Fecha no disponible';
    }
  };

  const formatearPrecio = (precio) => {
    if (precio === null || precio === undefined || precio === 0) return '$0';  
    const precioNum = Number(precio);
    if (isNaN(precioNum)) return '$0';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precioNum);
  };

  const getEstadoColor = (estado) => {
    if (!estado) return 'estado-pendiente';
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'PROCESANDO': return 'estado-procesando';
      case 'ENVIADO': return 'estado-enviado';
      case 'ENTREGADO': return 'estado-entregado';
      case 'CANCELADO': return 'estado-cancelado';
      default: return 'estado-pendiente';
    }
  };

  const debugPedido = (pedido, index) => {
    console.log(`[DEBUG] Pedido ${index}:`, {
      id: pedido?.id,
      total: pedido?.total,
      fecha: pedido?.fechaCreacion,
      estado: pedido?.estado,
      detallesCount: pedido?.detalles?.length,
      detalles: pedido?.detalles?.map(d => ({
        producto: d?.productoDetalle?.nombreProducto,
        precio: d?.productoDetalle?.precioProducto,
        cantidad: d?.cantidadDetalle,
        talla: d?.talla
      }))
    });
  };

  if (cargando) {
    return (
      <>
        <Navbar />
        <div className="pedidos-page">
          <div className="pedidos-container">
            <div className="cargando">
              <div>Cargando pedidos...</div>
            </div>
          </div>
        </div>
        <footer>
          <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
        </footer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="pedidos-page">
          <div className="pedidos-container">
            <div className="error-container">
              <h3>Error al cargar pedidos</h3>
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn-reintentar">
                Reintentar
              </button>
            </div>
          </div>
        </div>
        <footer>
          <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
        </footer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pedidos-page">
        <div className="pedidos-container">
          <div className="pedidos-header">
            <h1>MIS PEDIDOS</h1>
            <p>Historial de tus compras</p>
          </div>
          <div className="pedidos-content">
            {pedidos.length === 0 ? (
              <div className="sin-pedidos">
                <h3>No tienes pedidos aún</h3>
                <p>Realiza tu primera compra para ver tus pedidos aquí</p>
                <button 
                  className="btn-comprar"
                  onClick={() => navigate('/productos')}
                >
                  Ir a Comprar
                </button>
              </div>
            ) : (
              <div className="lista-pedidos">
                {pedidos.map((pedido, index) => {
                  debugPedido(pedido, index);
                  const uniqueKey = pedido?.id 
                    ? `pedido-${pedido.id}` 
                    : `pedido-index-${index}-${Date.now()}`;               
                  return (
                    <div key={uniqueKey} className="pedido-card">
                      <div className="pedido-header">
                        <div className="pedido-info">
                          <h3>Pedido #{pedido?.id || `Temporal-${index + 1}`}</h3>
                          <span className={`estado ${getEstadoColor(pedido?.estado)}`}>
                            {pedido?.estado || 'PENDIENTE'}
                          </span>
                        </div>
                        <div className="pedido-fecha">
                          {formatearFecha(pedido?.fechaCreacion)}
                        </div>
                      </div>                    
                      <div className="pedido-detalles">
                        <div className="detalle-total">
                          <span>Total + IVA:</span>
                          <strong>{formatearPrecio(pedido?.total)}</strong>
                        </div>                       
                        {pedido?.detalles && pedido.detalles.length > 0 ? (
                          <div className="productos-lista">
                            <h4>Productos:</h4>
                            {pedido.detalles.map((detalle, detalleIndex) => {
                              const detalleKey = detalle?.idDetalle 
                                ? `detalle-${detalle.idDetalle}` 
                                : `detalle-p${pedido.id || 'temp'}-i${detalleIndex}`;                            
                              return (
                                <div key={detalleKey} className="producto-item">
                                  <div className="producto-info">
                                    <span className="producto-nombre">
                                      {detalle?.productoDetalle?.nombreProducto || 'Producto no disponible'}
                                    </span>
                                    <span className="producto-talla">Talla: {detalle?.talla || 'S'}</span>
                                  </div>
                                  <div className="producto-precios">
                                    <span className="producto-cantidad">
                                      {detalle?.cantidadDetalle || 1} x {formatearPrecio(detalle?.productoDetalle?.precioProducto)}
                                    </span>
                                    <span className="producto-subtotal">
                                      {formatearPrecio(
                                        (detalle?.productoDetalle?.precioProducto || 0) * (detalle?.cantidadDetalle || 1)
                                      )}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="sin-detalles">
                            <p>No hay detalles disponibles para este pedido</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}