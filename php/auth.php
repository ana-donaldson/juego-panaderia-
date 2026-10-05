<?php
header('Content-Type: application/json');
include 'conexion.php';

// Recibir datos JSON del login.js
$datos = json_decode(file_get_contents('php://input'), true);

$accion = $datos['accion'] ?? '';
$usuario = $datos['usuario'] ?? '';
$email = $datos['email'] ?? '';
$contraseña = $datos['pass'] ?? '';

if ($accion === 'registro') {
    // --- REGISTRO ---
    if (empty($usuario) || empty($email) || empty($contraseña)) {
        echo json_encode(['ok' => false, 'mensaje' => 'Todos los campos son obligatorios']);
        exit;
    }

    // Verificar email duplicado
    $stmt = $conn->prepare("SELECT id FROM jugadores WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        echo json_encode(['ok' => false, 'mensaje' => 'Ese correo ya está registrado']);
        $stmt->close(); $conn->close(); exit;
    }
    $stmt->close();

    // Verificar usuario duplicado
    $stmt = $conn->prepare("SELECT id FROM jugadores WHERE nombre_usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        echo json_encode(['ok' => false, 'mensaje' => 'Ese usuario ya existe']);
        $stmt->close(); $conn->close(); exit;
    }
    $stmt->close();

    // Hashear contraseña
    $hash = password_hash($contraseña, PASSWORD_DEFAULT);

    // Insertar
    $stmt = $conn->prepare("INSERT INTO jugadores (nombre_usuario, email, contraseña_hash) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $usuario, $email, $hash);

    if ($stmt->execute()) {
        echo json_encode([
            'ok' => true,
            'mensaje' => '¡Cuenta creada!',
            'usuario' => $usuario
        ]);
    } else {
        echo json_encode(['ok' => false, 'mensaje' => 'Error al registrar: ' . $conn->error]);
    }
    $stmt->close();

} else if ($accion === 'login') {
    // --- LOGIN ---
    if (empty($usuario) || empty($contraseña)) {
        echo json_encode(['ok' => false, 'mensaje' => 'Completá todos los campos']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, nombre_usuario, contraseña_hash FROM jugadores WHERE nombre_usuario = ? OR email = ?");
    $stmt->bind_param("ss", $usuario, $usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $user = $resultado->fetch_assoc();
        if (password_verify($contraseña, $user['contraseña_hash'])) {
            echo json_encode([
                'ok' => true,
                'mensaje' => '¡Bienvenido!',
                'usuario' => $user['nombre_usuario']
            ]);
        } else {
            echo json_encode(['ok' => false, 'mensaje' => 'Usuario o contraseña incorrectos']);
        }
    } else {
        echo json_encode(['ok' => false, 'mensaje' => 'Usuario o contraseña incorrectos']);
    }
    $stmt->close();

} else if ($accion === 'recuperar') {
    // --- RECUPERAR CONTRASEÑA (simulado por ahora) ---
    echo json_encode(['ok' => true, 'mensaje' => 'Si el correo está registrado, te enviamos un enlace.']);
} else {
    echo json_encode(['ok' => false, 'mensaje' => 'Acción no válida']);
}

$conn->close();
?>