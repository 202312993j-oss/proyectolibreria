<?php
// ============================================================
// ProductoController - CRUD de productos
// ============================================================

header("Content-Type: application/json");
require_once __DIR__ . "/../config/sesion.php";
require_once __DIR__ . "/../config/conexion.php";
require_once __DIR__ . "/../models/Producto.php";

requiereSesion(); // protege la ruta: solo usuarios autenticados

$modelo = new Producto($conexion);
$accion = $_GET["accion"] ?? "listar";

switch ($accion) {

    case "listar":
        $busqueda = $_GET["busqueda"] ?? "";
        echo json_encode(["ok" => true, "productos" => $modelo->listar($busqueda)]);
        break;

    case "crear":
        $nombre       = trim($_POST["nombre_producto"] ?? "");
        $id_categoria = (int) ($_POST["id_categoria"] ?? 0);
        $precio       = (float) ($_POST["precio"] ?? -1);
        $stock        = (int) ($_POST["stock"] ?? -1);

        if (empty($nombre) || $id_categoria <= 0 || $precio <= 0 || $stock < 0) {
            echo json_encode(["ok" => false, "mensaje" => "Datos inválidos. Verifique nombre, categoría, precio y stock."]);
            break;
        }

        $ok = $modelo->crear($nombre, $id_categoria, $precio, $stock);
        echo json_encode(["ok" => $ok, "mensaje" => $ok ? "Producto registrado correctamente." : "No se pudo registrar el producto."]);
        break;

    case "editar":
        $id           = (int) ($_POST["id_producto"] ?? 0);
        $nombre       = trim($_POST["nombre_producto"] ?? "");
        $id_categoria = (int) ($_POST["id_categoria"] ?? 0);
        $precio       = (float) ($_POST["precio"] ?? -1);
        $stock        = (int) ($_POST["stock"] ?? -1);

        if ($id <= 0 || empty($nombre) || $id_categoria <= 0 || $precio <= 0 || $stock < 0) {
            echo json_encode(["ok" => false, "mensaje" => "Datos inválidos para actualizar el producto."]);
            break;
        }

        $ok = $modelo->editar($id, $nombre, $id_categoria, $precio, $stock);
        echo json_encode(["ok" => $ok, "mensaje" => $ok ? "Producto actualizado correctamente." : "No se pudo actualizar el producto."]);
        break;

    case "eliminar":
        $id = (int) ($_POST["id_producto"] ?? 0);
        if ($id <= 0) {
            echo json_encode(["ok" => false, "mensaje" => "Producto no válido."]);
            break;
        }
        $ok = $modelo->eliminar($id);
        echo json_encode(["ok" => $ok, "mensaje" => $ok ? "Producto eliminado correctamente." : "No se pudo eliminar el producto."]);
        break;

    default:
        http_response_code(400);
        echo json_encode(["ok" => false, "mensaje" => "Acción no válida."]);
}
