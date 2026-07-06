<?php
// ============================================================
// Modelo Usuario
// ============================================================

class Usuario {
    private $conexion;

    public function __construct($conexion) {
        $this->conexion = $conexion;
    }

    public function buscarPorUsuario($usuario) {
        $sql = "SELECT * FROM usuarios WHERE usuario = ? AND estado = 1";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }
}
