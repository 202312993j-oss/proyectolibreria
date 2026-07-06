<?php
// ============================================================
// VentaController - registro e historial de ventas
// ============================================================

header("Content-Type: application/json");
require_once __DIR__ . "/../config/sesion.php";
require_once __DIR__ . "/../config/conexion.php";
require_once __DIR__ . "/../models/Venta.php";
require_once __DIR__ . "/../models/Producto.php";

requiereSesion(); // protege la ruta: solo usuarios autenticados

$accion = $_GET["accion"] ?? "listar";
$modelo = new Venta($conexion);

if ($accion === "listar") {
    echo json_encode(["ok" => true, "ventas" => $modelo->listarRecientes(10)]);
    exit;
}

if ($accion === "registrar") {
    $datos = json_decode(file_get_contents("php://input"), true);

    $cliente = trim($datos["cliente"] ?? "");
    $items   = $datos["items"] ?? [];

    if (empty($items) || !is_array($items)) {
        echo json_encode(["ok" => false, "mensaje" => "No hay productos en la venta."]);
        exit;
    }

    // Validación de cada ítem en el servidor (nunca confiar solo en el frontend)
    foreach ($items as $item) {
        if (
            empty($item["id_producto"]) ||
            !isset($item["cantidad"]) || $item["cantidad"] <= 0 ||
            !isset($item["precio"]) || $item["precio"] <= 0
        ) {
            echo json_encode(["ok" => false, "mensaje" => "Uno de los productos enviados no es válido."]);
            exit;
        }
    }

    $resultado = $modelo->registrar($_SESSION["id_usuario"], $cliente, $items);
    echo json_encode($resultado);
    exit;
}

http_response_code(400);
echo json_encode(["ok" => false, "mensaje" => "Acción no válida."]);
