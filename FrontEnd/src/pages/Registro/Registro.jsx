import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';
import Navbar from '../../components/Navbar/Navbar';

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    fecha: '',
    region: '',
    comuna: '',
    direccion: '',
    password: '',
  });

  const regionesYComunas = {
    "Región Metropolitana": ["Santiago", "Melipilla", "Puente Alto", "Maipú"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quillota"],
    "Biobío": ["Concepción", "Los Ángeles", "Chillán"]
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const runValido = /^[0-9]{7,8}[0-9K]$/i;
    if (!runValido.test(form.run)) return alert("RUN inválido. Debe tener entre 7 y 9 caracteres, sin puntos ni guión.");
    if (!form.nombre || form.nombre.length > 50) return alert("Nombre requerido, máximo 50 caracteres.");
    if (!form.apellidos || form.apellidos.length > 100) return alert("Apellidos requeridos, máximo 100 caracteres.");
    if (!form.email || form.email.length > 100) return alert("Correo requerido, máximo 100 caracteres.");
    const dominioValido = /@duoc\.cl$|@profesor\.duoc\.cl$|@gmail\.com$/;
    if (!dominioValido.test(form.email)) return alert("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
    if (!form.region || !form.comuna) return alert("Selecciona región y comuna");
    if (!form.direccion || form.direccion.length > 300) return alert("Dirección requerida, máximo 300 caracteres.");
    if (!form.password || form.password.length < 6) return alert("Contraseña requerida, mínimo 6 caracteres.");

    const usuario = {
      rutUsuario: form.run,
      nombreUsuario: form.nombre,
      apellidosUsuario: form.apellidos,
      correoUsuario: form.email,
      nacimientoUsuario: form.fecha,
      regionUsuario: form.region,
      comunaUsuario: form.comuna,
      direccionUsuario: form.direccion,
      contraseniaUsuario: form.password,
      rolUsuario: "CLIENTE"
    };

    try {
      const res = await fetch("http://localhost:8080/tumtum/usuarios/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });
      if (res.status === 409) {
        alert("RUN o correo ya registrado");
      } else if (!res.ok) {
        alert("Error al registrar");
      } else {
        alert("Registro exitoso");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <>
      <Navbar />
      <main className="registro-page">
        <div className="registro-container">
          <h2>Registrarse</h2>
          <form onSubmit={handleSubmit}>
            <input id="run" placeholder="RUN (Ej: 19011022K)" value={form.run} onChange={handleChange} />
            <input id="nombre" placeholder="Nombre *" value={form.nombre} onChange={handleChange} />
            <input id="apellidos" placeholder="Apellidos *" value={form.apellidos} onChange={handleChange} />
            <input id="email" placeholder="Correo electrónico *" value={form.email} onChange={handleChange} />
            <input id="fecha" type="date" placeholder="dd/mm/aaaa" value={form.fecha} onChange={handleChange} />
            <select id="region" value={form.region} onChange={handleChange}>
              <option value="">Selecciona región</option>
              {Object.keys(regionesYComunas).map(r => <option key={r}>{r}</option>)}
            </select>
            <select id="comuna" value={form.comuna} onChange={handleChange}>
              <option value="">Selecciona comuna</option>
              {(regionesYComunas[form.region] || []).map(c => <option key={c}>{c}</option>)}
            </select>
            <input id="direccion" placeholder="Dirección completa" value={form.direccion} onChange={handleChange} />
            <input id="password" type="password" placeholder="Contraseña *" value={form.password} onChange={handleChange} />
            <button type="submit">Registrarse</button>
          </form>
          <p className="login-link">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </p>
        </div>
      </main>
      <footer>
        <p>&copy; 2025 TumTum Ropa. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
