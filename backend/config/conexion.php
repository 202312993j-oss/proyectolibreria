<?php
// ============================================================
// Conexión a la base de datos - Compra tu Coquito
// ============================================================

$host     = "localhost";
$usuario  = "root";
$password = "";
$bd       = "bd_coquito";

$conexion = new mysqli($host, $usuario, $password, $bd);

if ($conexion->connect_error) {
    // No se muestran errores técnicos al usuario final
    http_response_code(500);
    die(json_encode([
        "ok" => false,
        "mensaje" => "No se pudo conectar con el servidor. Intente más tarde."
    ]));
}

$conexion->set_charset("utf8mb4");
