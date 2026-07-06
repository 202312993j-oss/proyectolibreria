-- ============================================================
-- Base de datos: bd_coquito
-- Proyecto: Compra tu Coquito - Sistema de Ventas
-- ============================================================

CREATE DATABASE IF NOT EXISTS bd_coquito;
USE bd_coquito;

-- ------------------------------------------------------------
-- Tabla roles
-- ------------------------------------------------------------
CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

-- ------------------------------------------------------------
-- Tabla usuarios
-- ------------------------------------------------------------
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    estado TINYINT DEFAULT 1,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- ------------------------------------------------------------
-- Tabla categorias
-- ------------------------------------------------------------
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    estado TINYINT DEFAULT 1
);

-- ------------------------------------------------------------
-- Tabla productos
-- ------------------------------------------------------------
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(150) NOT NULL,
    id_categoria INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    estado TINYINT DEFAULT 1,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- ------------------------------------------------------------
-- Tabla clientes
-- ------------------------------------------------------------
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(150) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Tabla ventas (cabecera)
-- ------------------------------------------------------------
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NULL,
    id_usuario INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ------------------------------------------------------------
-- Tabla detalle_ventas (items de cada venta)
-- ------------------------------------------------------------
CREATE TABLE detalle_ventas (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal_item DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- ============================================================
-- Datos iniciales
-- ============================================================

INSERT INTO roles (nombre_rol) VALUES
('Administrador'),
('Vendedor');

-- Contraseña real: usuario123  (hash generado con password_hash de PHP, algoritmo BCRYPT)
INSERT INTO usuarios (nombres, apellidos, usuario, correo, password, id_rol) VALUES
('Administrador', 'Sistema', 'administrador', 'admin@compratucoquito.com',
 '$2b$10$ivLDo8fsbEOWv1EWtx5h6.43Q18jN1kIAiyySIPIZZdwnrSbNbeFC', 1);

INSERT INTO categorias (nombre_categoria) VALUES
('Papelería'),
('Libros'),
('Útiles'),
('Vinilos');

INSERT INTO productos (nombre_producto, id_categoria, precio, stock) VALUES
('Cuaderno A4 espiral', 1, 8.50, 30),
('Lapicero azul Pilot', 1, 3.00, 50),
('El Principito', 2, 28.00, 10),
('Tijera escolar', 3, 5.50, 0),
('Resaltador x3 colores', 1, 7.00, 20),
('Regla 30cm', 3, 3.00, 15),
('1984 - George Orwell', 2, 35.00, 5),
('Lápices 2B x12', 1, 6.00, 25),
('Vinilo – To Pimp a Butterfly', 4, 89.90, 5),
('Vinilo – Good Kid, M.A.A.D City', 4, 84.90, 5);
