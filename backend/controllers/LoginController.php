<?php
// ============================================================
// LoginController - inicio y cierre de sesión
// ============================================================

header("Content-Type: application/json");
require_once __DIR__ . "/../config/sesion.php";
require_once __DIR__ . "/../config/conexion.php";
require_once __DIR__ . "/../models/Usuario.php";

$accion = $_GET["accion"] ?? "";

if ($accion === "login") {
    $usuario  = trim($_POST["usuario"] ?? "");
    $password = $_POST["password"] ?? "";

    if (empty($usuario) || empty($password)) {
        echo json_encode(["ok" => false, "mensaje" => "Usuario y contraseña son obligatorios."]);
        exit;
    }

    $modeloUsuario = new Usuario($conexion);
    $fila = $modeloUsuario->buscarPorUsuario($usuario);

    if ($fila && password_verify($password, $fila["password"])) {
        session_regenerate_id(true);
        $_SESSION["id_usuario"] = $fila["id_usuario"];
        $_SESSION["nombres"]    = $fila["nombres"];
        $_SESSION["id_rol"]     = $fila["id_rol"];

        echo json_encode([
            "ok" => true,
            "usuario" => [
                "nombres" => $fila["nombres"],
                "apellidos" => $fila["apellidos"]
            ]
        ]);
    } else {
        echo json_encode(["ok" => false, "mensaje" => "Usuario o contraseña incorrectos."]);
    }
    exit;
}

if ($accion === "logout") {
    $_SESSION = [];
    session_destroy();
    echo json_encode(["ok" => true]);
    exit;
}

if ($accion === "estado") {
    echo json_encode(["ok" => isset($_SESSION["id_usuario"])]);
    exit;
}

http_response_code(400);
echo json_encode(["ok" => false, "mensaje" => "Acción no válida."]);
