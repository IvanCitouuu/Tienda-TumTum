const API_BASE_URL = 'http://localhost:8080/tumtum';

const fetchAPI = async (endpoint, options = {}) => {
  try {
    console.log(`Haciendo request a: ${API_BASE_URL}${endpoint}`);
    
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options
    };
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token JWT incluido en la request');
    } else {
      console.log('No hay token JWT disponible');
    }
    
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
      console.log('Body enviado:', config.body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (response.status === 401) {
      console.log('Token inválido o expirado - redirigiendo a login');
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioActivo');
      window.location.href = '/login';
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text || { message: 'Operación exitosa' };
      console.log('Response texto:', text);
    }
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

export const productosAPI = {
  obtenerProductos: async () => {
    try {
      console.log('Obteniendo productos...');
      const data = await fetchAPI('/productos');
      const productosMapeados = data.map(p => ({
        id: p.idProducto,
        nombre: p.nombreProducto,
        descripcion: p.descripcionProducto,
        categoria: p.categoriaProducto,
        imagen: p.imgUrlProducto,
        estado: p.estadoProducto,
        stock: p.stockProducto,
        precio: p.precioProducto,
        fechaCreacion: p.fechaCreacionProducto
      }));
      console.log(`${productosMapeados.length} productos obtenidos`);
      return productosMapeados;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  },

  obtenerProducto: async (id) => {
    try {
      const data = await fetchAPI(`/productos/${id}`);
      return {
        id: data.idProducto,
        nombre: data.nombreProducto,
        descripcion: data.descripcionProducto,
        categoria: data.categoriaProducto,
        imagen: data.imgUrlProducto,
        estado: data.estadoProducto,
        stock: data.stockProducto,
        precio: data.precioProducto,
        fechaCreacion: data.fechaCreacionProducto
      };
    } catch (error) {
      console.error(`Error obteniendo producto ${id}:`, error);
      throw error;
    }
  },

  crearProducto: async (producto) => {
    try {
      const body = {
        nombreProducto: producto.nombre || '',
        descripcionProducto: producto.descripcion || '',
        categoriaProducto: producto.categoria || '',
        imgUrlProducto: producto.imagen || '',
        estadoProducto: producto.estado || 'ACTIVO',
        stockProducto: parseInt(producto.stock) || 0,
        precioProducto: parseInt(producto.precio) || 0
      };
      console.log('Creando producto:', body);
      const resultado = await fetchAPI('/productos', {
        method: 'POST',
        body: body
      });
      console.log('Producto creado exitosamente');
      return resultado;
    } catch (error) {
      console.error('Error creando producto:', error);
      throw error;
    }
  },

  actualizarProducto: async (id, producto) => {
    try {
      const body = {
        nombreProducto: producto.nombre,
        descripcionProducto: producto.descripcion,
        categoriaProducto: producto.categoria,
        imgUrlProducto: producto.imagen,
        estadoProducto: producto.estado,
        stockProducto: parseInt(producto.stock),
        precioProducto: parseInt(producto.precio)
      };
      console.log(`Actualizando producto ${id}:`, body);
      const resultado = await fetchAPI(`/productos/${id}`, {
        method: 'PUT',
        body: body
      });
      console.log('Producto actualizado exitosamente');
      return resultado;
    } catch (error) {
      console.error(`Error actualizando producto ${id}:`, error);
      throw error;
    }
  },

  eliminarProducto: async (id) => {
    try {
      console.log(`Eliminando producto ${id}...`);
      const resultado = await fetchAPI(`/productos/${id}`, {
        method: 'DELETE'
      });
      console.log('Producto eliminado exitosamente');
      return resultado;
    } catch (error) {
      console.error(`Error eliminando producto ${id}:`, error);
      throw error;
    }
  }
};

export const usuariosAPI = {
  obtenerUsuarios: async () => {
    try {
      console.log('Obteniendo usuarios...');
      const data = await fetchAPI('/usuarios');
      const usuariosMapeados = data.map(u => ({
        id: u.idUsuario,
        nombre: u.nombreUsuario,
        apellidos: u.apellidosUsuario,
        email: u.correoUsuario,
        contrasenia: u.contraseniaUsuario,
        rol: u.rolUsuario,
        estado: u.estadoUsuario,
        direccion: u.direccionUsuario,
        nacimiento: u.nacimientoUsuario,
        region: u.regionUsuario,
        comuna: u.comunaUsuario,
        rut: u.rutUsuario,
        fechaCreacion: u.fechaCreacionUsuario
      }));
      console.log(`${usuariosMapeados.length} usuarios obtenidos`);
      return usuariosMapeados;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  },

  obtenerUsuario: async (id) => {
    try {
      const data = await fetchAPI(`/usuarios/${id}`);
      return {
        id: data.idUsuario,
        nombre: data.nombreUsuario,
        apellidos: data.apellidosUsuario,
        email: data.correoUsuario,
        rol: data.rolUsuario,
        estado: data.estadoUsuario,
        direccion: data.direccionUsuario,
        nacimiento: data.nacimientoUsuario,
        region: data.regionUsuario,
        comuna: data.comunaUsuario,
        rut: data.rutUsuario,
        fechaCreacion: data.fechaCreacionUsuario
      };
    } catch (error) {
      console.error(`Error obteniendo usuario ${id}:`, error);
      throw error;
    }
  },

  actualizarUsuario: async (id, usuario) => {
    try {
      const body = {};
      const agregarCampo = (campoBackend, valor) => {
        if (valor !== undefined && valor !== null && valor !== '') {
          body[campoBackend] = valor;
        }
      };
      agregarCampo('nombreUsuario', usuario.nombre);
      agregarCampo('apellidosUsuario', usuario.apellidos);
      agregarCampo('correoUsuario', usuario.email);
      agregarCampo('rolUsuario', usuario.rol);
      agregarCampo('estadoUsuario', usuario.estado);
      agregarCampo('direccionUsuario', usuario.direccion);
      agregarCampo('nacimientoUsuario', usuario.nacimiento);
      agregarCampo('regionUsuario', usuario.region);
      agregarCampo('comunaUsuario', usuario.comuna);
      agregarCampo('rutUsuario', usuario.rut);
      if (Object.keys(body).length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }
      console.log(`Actualizando usuario ${id}:`, body);
      const resultado = await fetchAPI(`/usuarios/${id}`, {
        method: 'PUT',
        body: body
      });
      console.log('Usuario actualizado exitosamente');
      return resultado;
    } catch (error) {
      console.error(`Error actualizando usuario ${id}:`, error);
      throw error;
    }
  },

  actualizarRolUsuario: async (id, rol) => {
    try {
      console.log(`Actualizando rol del usuario ${id} a: ${rol}`);
      const usuarioBackend = await fetchAPI(`/usuarios/${id}`);
      console.log('Usuario desde backend:', usuarioBackend);
      const body = {
        nombreUsuario: usuarioBackend.nombreUsuario,
        apellidosUsuario: usuarioBackend.apellidosUsuario,
        correoUsuario: usuarioBackend.correoUsuario,
        rolUsuario: rol,
        estadoUsuario: usuarioBackend.estadoUsuario,
        direccionUsuario: usuarioBackend.direccionUsuario,
        nacimientoUsuario: usuarioBackend.nacimientoUsuario,
        regionUsuario: usuarioBackend.regionUsuario,
        comunaUsuario: usuarioBackend.comunaUsuario,
        rutUsuario: usuarioBackend.rutUsuario
      };
      console.log('Body enviado:', body);
      const resultado = await fetchAPI(`/usuarios/${id}`, {
        method: 'PUT',
        body: body
      });
      console.log('Rol actualizado exitosamente');
      return resultado;
    } catch (error) {
      console.error(`Error actualizando rol del usuario ${id}:`, error);
      throw error;
    }
  },

  eliminarUsuario: async (id) => {
    try {
      console.log(`Eliminando usuario ${id}...`);
      const resultado = await fetchAPI(`/usuarios/${id}`, {
        method: 'DELETE'
      });
      console.log('Usuario eliminado exitosamente');
      return resultado;
    } catch (error) {
      console.error(`Error eliminando usuario ${id}:`, error);
      throw error;
    }
  },

  login: async (credenciales) => {
    try {
      const body = {
        correoUsuario: credenciales.email,
        contraseniaUsuario: credenciales.password
      };
      console.log('Iniciando sesión...');
      const resultado = await fetchAPI('/usuarios/login', {
        method: 'POST',
        body: body
      });
      if (resultado.token && resultado.usuario) {
        console.log('Login exitoso - Token recibido');
        return resultado;
      } else {
        console.log('Login exitoso pero sin token - respuesta antigua');
        return resultado;
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  
  registrar: async (usuario) => {
    try {
      console.log('Registrando nuevo usuario...');
      const resultado = await fetchAPI('/usuarios/register', {
        method: 'POST',
        body: usuario
      });
      console.log('Usuario registrado exitosamente');
      return resultado;
    } catch (error) {
      console.error('Error registrando usuario:', error);
      throw error;
    }
  },

  obtenerUsuarioActivo: async () => {
    try {
      console.log('Obteniendo usuario activo...');
      const resultado = await fetchAPI('/usuarios/activo');
      console.log('Usuario activo obtenido');
      return resultado;
    } catch (error) {
      console.error('Error obteniendo usuario activo:', error);
      throw error;
    }
  }
};

export const pedidosAPI = {
  obtenerPedidosPorUsuario: async (correo) => {
    try {
      console.log(`Obteniendo pedidos del usuario: ${correo}`);
      const data = await fetchAPI(`/pedidos/usuario/${correo}`);
      console.log('=== DEBUG PEDIDOS BACKEND ===');
      console.log('Respuesta CRUDA del backend:', data);
      data.forEach((pedido, index) => {
        console.log(`Pedido ${index} estructura:`, pedido);
        console.log(`Pedido ${index} keys:`, Object.keys(pedido));
        console.log(`Pedido ${index} tiene idPedido?:`, 'idPedido' in pedido);
        console.log(`Pedido ${index} tiene totalPedido?:`, 'totalPedido' in pedido);
        console.log(`Pedido ${index} tiene fechaCreacionPedido?:`, 'fechaCreacionPedido' in pedido);
        console.log(`Pedido ${index} tiene estadoPedido?:`, 'estadoPedido' in pedido);
        console.log(`Pedido ${index} tiene detalles?:`, 'detalles' in pedido);
      });
      console.log('=== FIN DEBUG ===');  
      const pedidosMapeados = data.map(p => ({
        id: p.idPedido,
        correoCliente: p.correoClientePedido,
        estado: p.estadoPedido,
        nombreCliente: p.nombreClientePedido,
        total: p.totalPedido,
        fechaCreacion: p.fechaCreacionPedido,
        detalles: p.detalles
      }));
      console.log(`${pedidosMapeados.length} pedidos obtenidos para ${correo}`);
      return pedidosMapeados;
    } catch (error) {
      console.error(`Error obteniendo pedidos para ${correo}:`, error);
      return [];
    }
  },

  obtenerPedido: async (id) => {
  try {
    const data = await fetchAPI(`/pedidos/${id}`);
    const detallesFormateados = (data.detalles || []).map(detalle => ({
      id: detalle.idDetalle,
      producto: detalle.productoDetalle,
      cantidad: detalle.cantidadDetalle,
      talla: detalle.talla
    }));
    return {
      id: data.idPedido,
      correoCliente: data.correoClientePedido,
      estado: data.estadoPedido,
      nombreCliente: data.nombreClientePedido,
      total: data.totalPedido,
      fechaCreacion: data.fechaCreacionPedido,
      detalles: detallesFormateados
    };
  } catch (error) {
    console.error(`Error obteniendo pedido ${id}:`, error);
    throw error;
  }
},

  obtenerPedidos: async () => {
    try {
      console.log('Obteniendo todos los pedidos...');
      const data = await fetchAPI('/pedidos');
      
      console.log('=== DEBUG TODOS LOS PEDIDOS BACKEND ===');
      console.log('Respuesta CRUDA de todos los pedidos:', data);
      
      if (data && data.length > 0) {
        data.forEach((pedido, index) => {
          console.log(`Pedido ${index} estructura:`, pedido);
          console.log(`Pedido ${index} keys:`, Object.keys(pedido));
        });
      }
      console.log('=== FIN DEBUG TODOS LOS PEDIDOS ===');
      const pedidosMapeados = data.map(p => ({
        id: p.idPedido,
        correoCliente: p.correoClientePedido,
        estado: p.estadoPedido,
        nombreCliente: p.nombreClientePedido,
        total: p.totalPedido,
        fechaCreacion: p.fechaCreacionPedido,
        detalles: p.detalles
      }));
      console.log(`${pedidosMapeados.length} pedidos obtenidos en total`);
      return pedidosMapeados;
    } catch (error) {
      console.error('Error obteniendo todos los pedidos:', error);
      return [];
    }
  },
  
  crearPedido: async (pedido) => {
    try {
      const body = {
        estadoPedido: pedido.estado || 'PENDIENTE',
        correoClientePedido: pedido.correoCliente,
        nombreClientePedido: pedido.nombreCliente,
        totalPedido: pedido.total,
        detalles: pedido.detalles.map(d => ({
          idProducto: d.productoId,
          cantidadDetalle: d.cantidad,
          talla: d.talla || 'M'
        }))
      };
      console.log('Creando pedido:', body);
      const resultado = await fetchAPI('/pedidos', {
        method: 'POST',
        body: body
      });
      console.log('Pedido creado exitosamente');
      return resultado;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  },

  actualizarPedido: async (id, pedido) => {
    try {
      const body = {
        correoClientePedido: pedido.correoCliente,
        nombreClientePedido: pedido.nombreCliente,
        estadoPedido: pedido.estado,
        totalPedido: pedido.total,
        detalles: pedido.detalles
      };
      console.log(`Actualizando pedido ${id}:`, body);
      const resultado = await fetchAPI(`/pedidos/${id}`, {
        method: 'PUT',
        body: body
      });
      console.log('Pedido actualizado exitosamente');
      return resultado;

    } catch (error) {
      console.error(`Error actualizando pedido ${id}:`, error);
      throw error;
    }
  },

  actualizarEstadoPedido: async (id, estado) => {
  try {
    console.log(`Actualizando SOLO estado del pedido ${id} a: ${estado}`);
    const body = { 
      estado: estado 
    };
    console.log('Body enviado:', body);
    const resultado = await fetchAPI(`/pedidos/${id}/estado`, {
      method: 'PATCH',
      body: body
    });
    console.log('Estado de pedido actualizado exitosamente');
    return resultado;
  } catch (error) {
    console.error(`Error actualizando estado del pedido ${id}:`, error);
    throw error;
  }
},

  eliminarPedido: async (id) => {
    try {
      console.log(`Eliminando pedido ${id}...`);
      const resultado = await fetchAPI(`/pedidos/${id}`, {
        method: 'DELETE'
      });
      console.log('Pedido eliminado exitosamente');
      return resultado;
    } catch (error) {
      console.error(`Error eliminando pedido ${id}:`, error);
      throw error;
    }
  }
};

export const dashboardAPI = {
  obtenerEstadisticas: async () => {
    try {
      console.log('Obteniendo estadísticas del dashboard...');
      const [productos, usuarios, pedidos] = await Promise.all([
        productosAPI.obtenerProductos(),
        usuariosAPI.obtenerUsuarios(),
        pedidosAPI.obtenerPedidos()
      ]);
      const productosStockBajo = productos.filter(p => p.stock < 5).length;
      const inventarioActual = productos.reduce((sum, p) => sum + (p.stock || 0), 0);
      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();
      const nuevosUsuariosMes = usuarios.filter(u => {
        if (!u.fechaCreacion) return false;
        try {
          const fechaUsuario = new Date(u.fechaCreacion);
          return fechaUsuario.getMonth() === mesActual && 
                 fechaUsuario.getFullYear() === añoActual;
        } catch {
          return false;
        }
      }).length;
      const pedidosPendientes = pedidos.filter(p => p.estado === 'PENDIENTE').length;
      const estadisticas = {
        compras: pedidos.length,
        productos: productos.length,
        usuarios: usuarios.length,
        productosStockBajo: productosStockBajo,
        inventarioActual: inventarioActual,
        nuevosUsuariosMes: nuevosUsuariosMes,
        pedidosPendientes: pedidosPendientes
      };
      console.log('Estadísticas calculadas:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        compras: 0,
        productos: 0,
        usuarios: 0,
        productosStockBajo: 0,
        inventarioActual: 0,
        nuevosUsuariosMes: 0,
        pedidosPendientes: 0
      };
    }
  }
};

export const authAPI = {
  login: async (email, password) => {
    return await usuariosAPI.login({ email, password });
  },
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuarioActivo');
    console.log('Sesión cerrada');
  },
  getCurrentUser: async () => {
    return await usuariosAPI.obtenerUsuarioActivo();
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

export default {
  productosAPI,
  usuariosAPI,
  pedidosAPI,
  dashboardAPI,
  authAPI
};