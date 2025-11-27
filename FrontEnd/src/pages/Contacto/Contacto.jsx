import './Contacto.css';
import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';

export default function Contacto() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [comentario, setComentario] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert('El nombre es requerido');
    if (nombre.length > 100) return alert('El nombre no puede superar los 100 caracteres');
    if (email.length > 100) return alert('El correo no puede superar los 100 caracteres');
    const dominioValido = /@duoc\.cl$|@profesor\.duoc\.cl$|@gmail\.com$/;
    if (!dominioValido.test(email)) return alert('Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
    if (!comentario.trim()) return alert('El comentario es requerido');
    if (comentario.length > 500) return alert('El comentario no puede superar los 500 caracteres');
    alert('Mensaje enviado correctamente');
    setNombre('');
    setEmail('');
    setComentario('');
  };

  return (
    <div className="pagina-contacto">
      <Navbar />
      <main className="contacto-contenedor">
        <section className="seccion-contacto">
          <h1 className="titulo-contacto">CONTACTO</h1>
          <form className="formulario-contacto" onSubmit={handleSubmit}>
            <div className="fila-formulario">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="input-contacto"
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-contacto"
                required
              />
            </div>
            <textarea
              placeholder="Mensaje"
              rows="5"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="textarea-contacto"
              required
            />
            <button type="submit" className="boton-enviar">
              ENVIAR MENSAJE
            </button>
          </form>
        </section>
      </main>
      <footer className="footer-contacto">
        <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}