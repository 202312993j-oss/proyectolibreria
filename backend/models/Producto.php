<?php
// ============================================================
// Modelo Producto
// ============================================================

class Producto {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function listar($busqueda = "") {
        $sql = "SELECT p.id_producto, p.nombre_producto, c.nombre_categoria, p.precio, p.stock
                FROM productos p
                INNER JOIN categorias c ON p.id_categoria = c.id_categoria
                WHERE p.estado = 1 AND p.nombre_producto LIKE ?
                ORDER BY p.nombre_producto ASC";
        $like = "%" . $busqueda . "%";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("s", $like);
        $stmt->execute();
        $resultado = $stmt->get_result();
        return $resultado->fetch_all(MYSQLI_ASSOC);
    }

    public function crear($nombre, $id_categoria, $precio, $stock) {
        $sql = "INSERT INTO productos (nombre_producto, id_categoria, precio, stock) VALUES (?, ?, ?, ?)";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("sidi", $nombre, $id_categoria, $precio, $stock);
        return $stmt->execute();
    }

    public function editar($id, $nombre, $id_categoria, $precio, $stock) {
        $sql = "UPDATE productos SET nombre_producto = ?, id_categoria = ?, precio = ?, stock = ? WHERE id_producto = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("sidii", $nombre, $id_categoria, $precio, $stock, $id);
        return $stmt->execute();
    }

    public function eliminar($id) {
        // Borrado lógico, no físico
        $sql = "UPDATE productos SET estado = 0 WHERE id_producto = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function descontarStock($id, $cantidad) {
        $sql = "UPDATE productos SET stock = stock - ? WHERE id_producto = ? AND stock >= ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("iii", $cantidad, $id, $cantidad);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }

    public function obtenerPorId($id) {
        $sql = "SELECT * FROM productos WHERE id_producto = ? AND estado = 1";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
