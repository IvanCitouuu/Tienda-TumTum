import { useState } from 'react';
import './Carrito.css';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function Carrito() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    formatCLP 
  } = useCart();

  const handleQuantityChange = (productId, talla, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, talla);
    } else {
      updateQuantity(productId, talla, newQuantity);
    }
  };

  const eliminarProducto = (item) => {
    if (confirm(`¿Eliminar "${item.nombre}" (Talla: ${item.talla}) del carrito?`)) {
      removeFromCart(item.id, item.talla);
    }
  };

  const finalizarCompra = async () => {
  if (items.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  const token = localStorage.getItem('token');
  const usuarioData = localStorage.getItem('usuarioActivo');
  
  if (!token || !usuarioData) {
    alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
    localStorage.removeItem('usuarioActivo');
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  try {
    const usuario = JSON.parse(usuarioData);
    const subtotal = getTotalPrice();
    const iva = subtotal * 0.19;
    const totalConIVA = subtotal + iva;

    console.log('=== CÁLCULO IVA ===');
    console.log('Subtotal:', subtotal);
    console.log('IVA (19%):', iva);
    console.log('Total con IVA:', totalConIVA);

    setIsLoading(true);
    
    const pedido = {
      estadoPedido: "Pendiente",
      correoClientePedido: usuario.correoUsuario,
      nombreClientePedido: usuario.nombreUsuario,
      subtotalPedido: subtotal,
      ivaPedido: iva,
      totalPedido: totalConIVA,
      detalles: items.map(item => ({
        idProducto: parseInt(item.id),
        cantidadDetalle: item.cantidad,
        talla: item.talla || "S"
      }))
    };
    console.log('Pedido con IVA:', JSON.stringify(pedido, null, 2));
    const res = await fetch("http://localhost:8080/tumtum/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(pedido)
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText || res.statusText}`);
    }
    console.log('Pedido con IVA creado exitosamente');
    clearCart();
    alert("¡Gracias por tu compra! Pedido registrado correctamente.");
  } catch (err) {
    console.error("Error al finalizar compra:", err);
    if (err.message.includes('401')) {
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      localStorage.removeItem('usuarioActivo');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      alert(`No se pudo registrar el pedido: ${err.message}`);
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <Navbar />
      <main className="carrito-page">
        <div className="carrito-container">
          <h1>CARRITO DE COMPRAS</h1>
          {items.length === 0 ? (
            <div className="carrito-vacio">
              <p>Tu carrito está vacío.</p>
              <a href="/productos" className="btn-seguir-comprando">
                Seguir comprando
              </a>
            </div>
          ) : (
            <>
              <div className="carrito-items">
                {items.map((item, index) => (
                  <div key={`${item.id}-${item.talla}-${index}`} className="carrito-item">
                    <div className="item-imagen">
                      <img src={item.imagen} alt={item.nombre} />
                    </div>
                    
                    <div className="item-info">
                      <h3>{item.nombre}</h3>
                      <p className="item-talla">Talla: {item.talla}</p>
                      <p className="item-precio">{formatCLP(item.precio)}</p>
                    </div>
                    
                    <div className="item-cantidad">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.talla, item.cantidad - 1)}
                        className="btn-cantidad"
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.talla, item.cantidad + 1)}
                        className="btn-cantidad"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="item-total">
                      {formatCLP(item.precio * item.cantidad)}
                    </div>
                    
                    <div className="item-acciones">
                      <button 
                        onClick={() => eliminarProducto(item)}
                        className="btn-eliminar"
                        title="Eliminar producto"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="carrito-resumen">
                <div className="resumen-detalle">
                  <div className="resumen-linea">
                    <span>Subtotal:</span>
                    <span>{formatCLP(getTotalPrice())}</span>
                  </div>
                  <div className="resumen-linea">
                    <span>IVA (19%):</span>
                    <span>{formatCLP(getTotalPrice() * 0.19)}</span>
                  </div>
                  <div className="resumen-linea resumen-total">
                    <span><strong>Total:</strong></span>
                    <span><strong>{formatCLP(getTotalPrice() * 1.19)}</strong></span>
                  </div>
                  <p>{items.length} producto(s) en el carrito</p>
                </div>
                
                <div className="resumen-acciones">
                  <button 
                    onClick={clearCart}
                    className="btn-vaciar"
                  >
                    Vaciar carrito
                  </button>
                  
                  <button 
                    onClick={finalizarCompra}
                    className="btn-comprar"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Procesando...' : 'Finalizar compra'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <footer>
        <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}