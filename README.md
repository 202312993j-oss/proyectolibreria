PROYECTO: Compra tu Coquito
DESCRIPCIÓN:
Sistema web de punto de venta para una librería ficticia dedicada a la
venta de libros y artículos de oficina.

TECNOLOGÍAS:
- HTML5
- CSS3
- JavaScript (fetch / AJAX)
- PHP 8 (mysqli, sesiones, password_hash)
- MySQL
- XAMPP

MÓDULOS:
- Login con sesiones y contraseña cifrada
- Catálogo de productos con búsqueda
- Registro de venta (carrito, cálculo de IGV 18%)
- Historial de ventas
- CRUD de productos (backend/controllers/ProductoController.php)

BASE DE DATOS:
Nombre: bd_coquito
Tablas: roles, usuarios, categorias, productos, clientes, ventas, detalle_ventas

USUARIO DE DEMOSTRACIÓN:
Usuario: administrador
Contraseña: usuario123

INSTALACIÓN (XAMPP):
1. Copiar la carpeta del proyecto dentro de C:/xampp/htdocs/compratucoquito
2. Iniciar Apache y MySQL desde el panel de XAMPP.
3. Abrir http://localhost/phpmyadmin/ y crear la base de datos importando
   el archivo database/bd_coquito.sql
4. Verificar los datos de conexión en backend/config/conexion.php
   (usuario "root" y contraseña vacía por defecto en XAMPP).
5. Ejecutar el sistema desde:
   http://localhost/compratucoquito/frontend/index.php
