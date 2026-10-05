<?php
header('Content-Type: application/json');
include 'conexion.php';

// Recibir datos del juego (enviados desde JS con JSON)
$datos = json_decode(file_get_contents('php://input'), true);

$jugador_id = $datos['jugador_id'] ?? 0;
$puntuacion = $datos['puntuacion'] ?? 0;
$modo = $datos['modo'] ?? 'cajero';

if ($jugador_id == 0) {
    echo json_encode(['success' => false, 'mensaje' => 'Jugador no válido']);
    exit;
}

if ($modo === 'cajero') {
    $clientes_atendidos = $datos['clientes_atendidos'] ?? 0;
    $caja_final = $datos['caja_final'] ?? 0;

    $stmt = $conn->prepare("INSERT INTO partidas_cajero (jugador_id, puntuacion, clientes_atendidos, caja_final) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiid", $jugador_id, $puntuacion, $clientes_atendidos, $caja_final);
} else if ($modo === 'cocinero') {
    $recetas_completadas = $datos['recetas_completadas'] ?? 0;

    $stmt = $conn->prepare("INSERT INTO partidas_cocinero (jugador_id, puntuacion, recetas_completadas) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $jugador_id, $puntuacion, $recetas_completadas);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Modo no válido']);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Partida guardada correctamente']);
} else {
    echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>