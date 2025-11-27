import { useEffect, useState } from 'react';
import './Inicio.css';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

export default function Inicio() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(false);
  const slides = [
    { img: '/img/fondo1.jpg', title: 'NUEVO DROP' },
    { img: '/img/fondo2.jpg', title: 'REBAJAS' },
    { img: '/img/fondo3.jpg', title: 'NUEVO DROP' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, );

  useEffect(() => {
    const progress = document.getElementById('progress');
    if (progress) {
      progress.style.animation = 'none';
      void progress.offsetWidth;
      progress.style.animation = `progress 5000ms linear forwards`;
    }
  }, [currentSlide]);

  useEffect(() => {
    const scrollBtn = document.getElementById('scrollDown');
    const nextSection = document.getElementById('nextSection');
    const scrollToNext = () => nextSection?.scrollIntoView({ behavior: 'smooth' });

    scrollBtn?.addEventListener('click', scrollToNext);
    scrollBtn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToNext();
      }
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/tumtum/productos")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then(data => {
        const destacados = Array.isArray(data)
          ? data.filter(p => [1, 2, 3].includes(p.idProducto))
          : [];
        setProductos(destacados);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setError(true);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="carousel" id="carousel">
        {slides.map((slide, i) => (
          <div key={i} className={`slide ${i === currentSlide ? 'active' : ''}`}>
            <img src={slide.img} alt={`Slide ${i + 1}`} />
            <div className="overlay">
              <h1>{slide.title}</h1>
              <Link to="/productos" className="cta-button">COMPRAR</Link>
            </div>
          </div>
        ))}
        <div className="progress-bar">
          <div className="progress-fill" id="progress" />
        </div>
        <div className="scroll-down" id="scrollDown" role="button" tabIndex={0}>
          &#x25BC;
        </div>
      </div>

      <div className="container">
        <h3>NUEVO DROP</h3>
        <section id="nextSection" className="productos">
          {error ? (
            <p>Error al cargar productos. Intenta más tarde.</p>
          ) : productos.length === 0 ? (
            <p>No se encontraron productos destacados.</p>
          ) : (
            productos.map((producto) => (
              <div key={producto.idProducto} className="producto">
                <Link to={`/producto/${producto.idProducto}`}>
                  <img src={producto.imgUrlProducto} alt={producto.nombreProducto} />
                  <h2>{producto.nombreProducto}</h2>
                  <p>${producto.precioProducto.toLocaleString("es-CL")}</p>
                </Link>
              </div>
            ))
          )}
        </section>
      </div>

      <footer>
        <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
