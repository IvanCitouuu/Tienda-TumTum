# Proyecto: TumTum Clothing

## 1. Descripción del Proyecto

TumTum Clothing es una tienda virtual de ropa. Este repositorio corresponde a la **Experiencia 3** de la asignatura, la cual implementa una tienda online completa con **Spring Boot** en el backend y **React** en el frontend.

El enfoque principal de esta entrega es la implementación de **carrito de compras, autenticación segura con JWT, cálculo automático de IVA y testing automatizado**.

### Características Principales

* **Autenticación Segura:** Login con JWT, hashing de contraseñas con BCrypt, validación de correos institucionales
* **Carrito de Compras:** CRUD completo con persistencia en localStorage, gestión por tallas
* **Cálculo de IVA:** Automático al 19% en frontend y backend, persistencia en base de datos
* **Dashboard Administrativo:** Panel completo con gestión de usuarios, productos y pedidos
* **Testing Automatizado:** 14 pruebas con cobertura >80% usando Vitest y React Testing Library
* **Responsive Design:** Interfaz adaptable a diferentes dispositivos

## 2. Tecnologías Utilizadas

### Backend
* **Java 17** + **Spring Boot 3.x**
  * Spring Security + JWT
  * Spring Data JPA
  * Spring Web
* **Base de Datos:** MySQL 8.0
* **Seguridad:** BCryptPasswordEncoder (salt rounds: 12)
* **Gestor de Dependencias:** Maven

### Frontend
* **React 18** + **Vite**
* **React Router DOM** - Navegación
* **Context API** - Estado global del carrito
* **Vitest** + **React Testing Library** - Testing
* **CSS3** - Estilos y responsive design

### Entorno
* **Base de Datos:** XAMPP (MySQL)
* **IDE Base de Datos:** MySQL Workbench
* **Control de Versiones:** Git y GitHub

## 3. Instrucciones de Instalación

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Prerrequisitos
* **Java JDK 17** o superior
* **Node.js 18** o superior
* **MySQL** (XAMPP recomendado)
* **Git**
* **IDE:** Visual Studio Code (recomendado)

### Extensiones VS Code Recomendadas
* **Extension Pack for Java** (Microsoft)
* **Spring Boot Extension Pack** (VMware)

### 1. Clonar el Repositorio
1.  Abre VS Code 
2.  Ve al apartado de git de VS Code ( en la barra alteral,entre el debug y el buscador)
3. Presiona en Clone Repository, luego, pon el link del repositorio (https://github.com/VicenteAlfaroS/TumTum-Clothing)

### 2. Configuración de la Base de Datos
1.  Inicia el módulo **MySQL** y **Apache** desde el panel de control de XAMPP.
2.  Abre MySQL Workbench y conéctate a tu instancia local.
3.  Crea un nuevo *schema* (base de datos) con el nombre: tumtum

### 3. Configuración del Backend (Spring Boot)
1.  Abre la carpeta del backend (BackEnd en la carpeta del proyecto) en tu explorador de VS Code.
2.  Las extensiones de Java y Spring Boot **detectarán automáticamente** el proyecto (`pom.xml`) y comenzarán a descargar todas las dependencias de Maven/Gradle. Puedes ver el progreso en la barra de estado de VS Code.
3.  Navega a `src/main/resources/application.properties`
4.  Asegúrate de que la configuración de la base de datos coincida con la que creaste:

    ```properties
    # Asegúrate de que el puerto (3306) y el nombre de la BD sean correctos
    spring.datasource.url=jdbc:mysql://localhost:3306/tumtum
    
    # Cambia esto si tu MySQL no usa 'root' y sin contraseña
    spring.datasource.username=root
    ```

### 4. Configuración del Frontend (React)
1.  Abre una terminal integrada en VS Code (`Terminal` > `Nuevo terminal` o `Ctrl+Shift+Ñ`).
2.  Asegúrate de que la terminal esté en la carpeta del frontend:
    ```bash
    cd FrontEnd
    ```
3.  En esa terminal, instala las dependencias:
    ```bash
    npm install

## 4. Instrucciones de Ejecución

Una vez instalado todo:

1.  **Iniciar Base de Datos:** Verifica que MySQL esté corriendo desde XAMPP.

2.  **Ejecutar Backend (Spring Boot):**

    * **Opción A: Con Visual Studio Code (Recomendado)**
        Si tienes VS Code con las extensiones **"Extension Pack for Java"** y **"Spring Boot Extension Pack"**, el proceso es automático:
        1.  Abre la carpeta del backend.
        2.  Ve a la pestaña de "Spring Boot" en la barra lateral.
        3.  Verás tu aplicación (ej: `tumtum-clothing`). Simplemente haz clic en el ícono de "Play" (Iniciar) al lado del nombre.

    * **Opción B: Por terminal (Modo tradicional)**
        1.  Abre una terminal en la carpeta del backend.
        2.  Ejecuta:
            ```bash
            # Si usas Maven
            ./mvnw spring-boot:run
            

    El backend estará corriendo en `http://localhost:8080`.

3.  **Ejecutar Frontend (React):**
    * Abre una terminal integrada en la carpeta del frontend y ejecuta:
        ```bash
        # Si usas NPM
        npm run dev
        

    * La aplicación se abrirá automáticamente en tu navegador en `http://localhost:5173`.

## 5. Credenciales de Prueba

### Usuarios Disponibles:
- **Administrador:** `juan@duoc.cl` / `juan123`
- **Administrador:** `ivan@duoc.cl` / `ivan123`  
- **Usuario Normal:** `logan@duoc.cl` / `logan123`
- **Usuario Normal:** `gabriel@duoc.cl` / `gabirel123`

### Notas:
- Solo se aceptan correos: `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com`.

## 6. Documentación de API

### Endpoints Principales:
- `POST /tumtum/usuarios/login` - Login con JWT
- `POST /tumtum/pedidos` - Crear pedido con IVA
- `GET /tumtum/productos` - Catálogo de productos

**Swagger UI:** `http://localhost:8080/swagger-ui/index.html#/`

## 7. Características Técnicas

### Seguridad
- Autenticación JWT
- Validación de correos institucionales
- Protección de rutas por roles

## 8. Características Destacadas

### Cálculo Automático de IVA (19%)
- Frontend calcula: `IVA = Subtotal × 0.19`
- Backend valida y persiste: subtotal, IVA y total
- Visualización clara en carrito y pedidos

### Carrito de Compras
- Gestión por talla y producto
- Actualización en tiempo real

## 9. Testing

### Frontend (React + Vitest)


# Ejecutar tests
npm run test

# Ejecutar tests con cobertura
npm run test:coverage

**Resultados:**
- 5 componentes testeados que son:

        1.  Navbar.test.jsx
        2.  CartContext.test.jsx
        3.  Carrito.test.jsx
        4.  Login.test.jsx
        5.  Productos.test.jsx
- 14 pruebas implementadas
- Cobertura: 80.7% statements, 92.85% functions  
- Todas las pruebas pasan ✅

## 10. Estructura del Proyecto
```TumTum-Clothing/
├── BackEnd/ # Spring Boot Application
├── FrontEnd/ # React Application
└── database/ # Scripts SQL
```
**Desarrollado para:** Experiencia 3
**Fecha de entrega:** 28 Noviembre 2025
