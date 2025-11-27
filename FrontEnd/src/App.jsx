import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio/Inicio.jsx';
import Productos from './pages/Productos/Productos.jsx';
import Producto from './pages/Producto/Producto.jsx';
import Contacto from './pages/Contacto/Contacto.jsx';
import Carrito from './pages/Carrito/Carrito.jsx';
import Login from './pages/Login/Login.jsx';
import Registro from './pages/Registro/Registro.jsx';
import AdminPanel from './pages/AdminPanel/AdminPanel.jsx';
import Perfil from './pages/Perfil/Perfil.jsx';
import Pedidos from './pages/Pedidos/Pedidos.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/productos" element={<AdminPanel />} />
        <Route path="/admin/usuarios" element={<AdminPanel />} />
        <Route path="/admin/pedidos" element={<AdminPanel />} />
        <Route path="/admin/reportes" element={<AdminPanel />} />
        <Route path="/admin/perfil" element={<AdminPanel />} />
        <Route path="/admin/tienda" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;