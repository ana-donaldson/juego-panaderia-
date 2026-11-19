<?php
header('Content-Type: application/json');
include 'conexion.php';

// Recibe lo que el jugador SUMÓ en esta tanda (no el total). El total se acumula
// en una única fila por jugador y modo: INSERT la primera vez, UPDATE las siguientes.
$datos = json_decode(file_get_contents('php://input'), true);

$jugador_id = (int)($datos['jugador_id'] ?? 0);
$puntuacion = max(0, (int)($datos['puntuacion'] ?? 0));
$modo = $datos['modo'] ?? 'cajero';

if ($jugador_id == 0) {
    echo json_encode(['success' => false, 'mensaje' => 'Jugador no válido']);
    exit;
}

if ($modo === 'cajero') {
    $clientes_atendidos = max(0, (int)($datos['clientes_atendidos'] ?? 0));
    $caja_final = $datos['caja_final'] ?? 0;

    $stmt = $conn->prepare("SELECT id FROM partidas_cajero WHERE jugador_id = ? ORDER BY id ASC LIMIT 1");
    $stmt->bind_param("i", $jugador_id);
    $stmt->execute();
    $fila = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($fila) {
        $stmt = $conn->prepare("UPDATE partidas_cajero SET puntuacion = puntuacion + ?, clientes_atendidos = clientes_atendidos + ?, caja_final = ?, fecha = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->bind_param("iidi", $puntuacion, $clientes_atendidos, $caja_final, $fila['id']);
    } else {
        $stmt = $conn->prepare("INSERT INTO partidas_cajero (jugador_id, puntuacion, clientes_atendidos, caja_final) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("iiid", $jugador_id, $puntuacion, $clientes_atendidos, $caja_final);
    }
} else if ($modo === 'cocinero') {
    $recetas_completadas = max(0, (int)($datos['recetas_completadas'] ?? 0));

    $stmt = $conn->prepare("SELECT id FROM partidas_cocinero WHERE jugador_id = ? ORDER BY id ASC LIMIT 1");
    $stmt->bind_param("i", $jugador_id);
    $stmt->execute();
    $fila = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($fila) {
        $stmt = $conn->prepare("UPDATE partidas_cocinero SET puntuacion = puntuacion + ?, recetas_completadas = recetas_completadas + ?, fecha = CURRENT_TIMESTAMP WHERE id = ?");
        $stmt->bind_param("iii", $puntuacion, $recetas_completadas, $fila['id']);
    } else {
        $stmt = $conn->prepare("INSERT INTO partidas_cocinero (jugador_id, puntuacion, recetas_completadas) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $jugador_id, $puntuacion, $recetas_completadas);
    }
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
