<?php
header('Content-Type: application/json');
include 'conexion.php';

// Recibir datos del formulario
$usuario = $_POST['usuario'] ?? '';
$email = $_POST['email'] ?? '';
$contraseña = $_POST['pass'] ?? '';

// Validaciones básicas
if (empty($usuario) || empty($email) || empty($contraseña)) {
    echo json_encode(['success' => false, 'mensaje' => 'Todos los campos son obligatorios']);
    exit;
}

if (strlen($usuario) < 3 || strlen($usuario) > 16) {
    echo json_encode(['success' => false, 'mensaje' => 'El usuario debe tener entre 3 y 16 caracteres']);
    exit;
}

if (!preg_match('/^[a-zA-Z0-9]+$/', $usuario)) {
    echo json_encode(['success' => false, 'mensaje' => 'El usuario solo puede tener letras y números']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'mensaje' => 'Correo electrónico inválido']);
    exit;
}

if (strlen($contraseña) < 8) {
    echo json_encode(['success' => false, 'mensaje' => 'La contraseña debe tener al menos 8 caracteres']);
    exit;
}

// Verificar que el email no exista
$stmt = $conn->prepare("SELECT id FROM jugadores WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'mensaje' => 'Ese correo ya está registrado']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Verificar que el usuario no exista
$stmt = $conn->prepare("SELECT id FROM jugadores WHERE nombre_usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'mensaje' => 'Ese usuario ya existe']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Hashear contraseña
$contraseña_hash = password_hash($contraseña, PASSWORD_DEFAULT);

// Insertar en la base de datos (SIN rol)
$stmt = $conn->prepare("INSERT INTO jugadores (nombre_usuario, email, contraseña_hash) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $usuario, $email, $contraseña_hash);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'mensaje' => 'Usuario registrado correctamente',
        'jugador_id' => $stmt->insert_id,
        'nombre_usuario' => $usuario
    ]);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error al registrar: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>