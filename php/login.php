<?php
header('Content-Type: application/json');
include 'conexion.php';

// Coro envía "usuario" (puede ser usuario o email) y "pass"
$usuario_input = $_POST['usuario'] ?? '';
$contraseña = $_POST['pass'] ?? '';

if (empty($usuario_input) || empty($contraseña)) {
    echo json_encode(['success' => false, 'mensaje' => 'Completá todos los campos']);
    exit;
}

// Buscar por nombre de usuario O por email
$stmt = $conn->prepare("SELECT id, nombre_usuario, contraseña_hash FROM jugadores WHERE nombre_usuario = ? OR email = ?");
$stmt->bind_param("ss", $usuario_input, $usuario_input);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();

    if (password_verify($contraseña, $usuario['contraseña_hash'])) {
        echo json_encode([
            'success' => true,
            'jugador_id' => $usuario['id'],
            'nombre_usuario' => $usuario['nombre_usuario']
        ]);
    } else {
        echo json_encode(['success' => false, 'mensaje' => 'Contraseña incorrecta']);
    }
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Usuario no encontrado']);
}

$stmt->close();
$conn->close();
?>