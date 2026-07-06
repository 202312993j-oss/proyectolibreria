<?php
// ============================================================
// Control de sesión - protege el acceso a rutas internas
// ============================================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function requiereSesion() {
    if (!isset($_SESSION["id_usuario"])) {
        http_response_code(401);
        header("Content-Type: application/json");
        echo json_encode([
            "ok" => false,
            "mensaje" => "Debe iniciar sesión para acceder a este recurso."
        ]);
        exit;
    }
}
