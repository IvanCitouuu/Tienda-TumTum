import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Producto.css';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { useCart } from '../../context/CartContext.jsx';

export default function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('S');
  const [cantidad, setCantidad] = useState(1);
  const { addToCart, formatCLP } = useCart();
  useEffect(() => {
    fetch(`http://localhost:8080/tumtum/productos/${id}`)
      .then(res => res.json())
      .then(p => {
        const adaptado = {
          id: p.idProducto.toString(),
          nombre: p.nombreProducto,
          categoria: p.categoriaProducto,
          precio: p.precioProducto,
          imagen: p.imgUrlProducto,
          stock: p.stockProducto,
          descripcion: p.descripcionProducto
        };
        setProducto(adaptado);
      })
      .catch(err => console.error('Error al cargar producto:', err));
  }, [id]);
  if (!producto) return (
    <>
      <Navbar />
      <p>Producto no encontrado</p>
    </>
  );

  const agregarAlCarrito = () => {
    addToCart({
      ...producto,
      talla: tallaSeleccionada,
      cantidad: cantidad
    });
    alert(`${producto.nombre} (talla ${tallaSeleccionada}) agregado al carrito`);
  };

  const aumentarCantidad = () => {
    setCantidad(prev => prev + 1);
  };

  const disminuirCantidad = () => {
    setCantidad(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <>
      <Navbar />
      <main className="detalle-producto">
        <img src={producto.imagen} alt={producto.nombre} />
        <div className="info">
          <h1>{producto.nombre}</h1>
          <p className="precio">
            {formatCLP(producto.precio)}
          </p>
          <p>{producto.descripcion}</p>

          <div className="opciones">
            <div className="selector-talla">
              <label htmlFor="talla">Talla:</label>
              <select 
                id="talla" 
                value={tallaSeleccionada}
                onChange={(e) => setTallaSeleccionada(e.target.value)}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div className="selector-cantidad">
              <label>Cantidad:</label>
              <div className="controles-cantidad">
                <button 
                  type="button" 
                  onClick={disminuirCantidad}
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span>{cantidad}</span>
                <button type="button" onClick={aumentarCantidad}>
                  +
                </button>
              </div>
            </div>

            <div className="precio-total">
              <strong>Total: </strong>
              {formatCLP(producto.precio * cantidad)}
            </div>

            <div className="tabla-talles">
              <h3>Guía de talles</h3>
              <table>
                <thead>
                  <tr><th>Talle</th><th>Ancho</th><th>Largo</th></tr>
                </thead>
                <tbody>
                  <tr><td>S</td><td>57 cm</td><td>78 cm</td></tr>
                  <tr><td>M</td><td>60 cm</td><td>80 cm</td></tr>
                  <tr><td>L</td><td>62 cm</td><td>82 cm</td></tr>
                  <tr><td>XL</td><td>65 cm</td><td>84 cm</td></tr>
                </tbody>
              </table>
            </div>

            <button className="agregar-carrito" onClick={agregarAlCarrito}>
              Agregar al carrito
            </button>

            <button 
              className="seguir-comprando"
              onClick={() => navigate('/productos')}
            >
              ← Seguir comprando
            </button>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}