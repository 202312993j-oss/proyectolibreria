<?php
// ============================================================
// Modelo Venta
// ============================================================

class Venta {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    private function obtenerOcrearCliente($nombreCliente) {
        $sql = "SELECT id_cliente FROM clientes WHERE nombre_cliente = ? LIMIT 1";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("s", $nombreCliente);
        $stmt->execute();
        $fila = $stmt->get_result()->fetch_assoc();
        if ($fila) {
            return $fila["id_cliente"];
        }
        $sqlInsert = "INSERT INTO clientes (nombre_cliente) VALUES (?)";
        $stmtInsert = $this->conexion->prepare($sqlInsert);
        $stmtInsert->bind_param("s", $nombreCliente);
        $stmtInsert->execute();
        return $this->conexion->insert_id;
    }

    public function registrar($idUsuario, $nombreCliente, $items) {
        $this->conexion->begin_transaction();
        try {
            $idCliente = $this->obtenerOcrearCliente($nombreCliente ?: "Sin nombre");

            $subtotal = 0;
            foreach ($items as $item) {
                $subtotal += $item["precio"] * $item["cantidad"];
            }
            $igv = round($subtotal * 0.18, 2);
            $total = round($subtotal + $igv, 2);

            $sqlVenta = "INSERT INTO ventas (id_cliente, id_usuario, subtotal, igv, total) VALUES (?, ?, ?, ?, ?)";
            $stmtVenta = $this->conexion->prepare($sqlVenta);
            $stmtVenta->bind_param("iiddd", $idCliente, $idUsuario, $subtotal, $igv, $total);
            $stmtVenta->execute();
            $idVenta = $this->conexion->insert_id;

            $producto = new Producto($this->conexion);

            foreach ($items as $item) {
                $subtotalItem = $item["precio"] * $item["cantidad"];
                $sqlDetalle = "INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario, subtotal_item)
                               VALUES (?, ?, ?, ?, ?)";
                $stmtDetalle = $this->conexion->prepare($sqlDetalle);
                $stmtDetalle->bind_param("iiidd", $idVenta, $item["id_producto"], $item["cantidad"], $item["precio"], $subtotalItem);
                $stmtDetalle->execute();

                $descontado = $producto->descontarStock($item["id_producto"], $item["cantidad"]);
                if (!$descontado) {
                    throw new Exception("Stock insuficiente para el producto ID " . $item["id_producto"]);
                }
            }

            $this->conexion->commit();
            return ["ok" => true, "id_venta" => $idVenta, "total" => $total];
        } catch (Exception $e) {
            $this->conexion->rollback();
            return ["ok" => false, "mensaje" => $e->getMessage()];
        }
    }

    public function listarRecientes($limite = 10) {
        $sql = "SELECT v.id_venta, v.fecha_venta, c.nombre_cliente, v.total,
                       (SELECT SUM(cantidad) FROM detalle_ventas d WHERE d.id_venta = v.id_venta) AS items
                FROM ventas v
                LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
                ORDER BY v.id_venta DESC
                LIMIT ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $limite);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}
