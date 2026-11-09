<?php
header('Content-Type: application/json; charset=utf-8');
include 'conexion.php';
$conn->set_charset('utf8mb4');

// Ranking: el MEJOR puntaje de cada jugador entre todas sus partidas (de ambos modos).
// No se suma: jugar más veces no da ventaja. Empate: orden alfabético por nombre.
$sql = "SELECT j.nombre_usuario AS nombre, t.puntaje
        FROM (
            SELECT jugador_id, MAX(puntuacion) AS puntaje
            FROM (
                SELECT jugador_id, puntuacion FROM partidas_cajero
                UNION ALL
                SELECT jugador_id, puntuacion FROM partidas_cocinero
            ) AS todas
            GROUP BY jugador_id
        ) AS t
        JOIN jugadores j ON j.id = t.jugador_id
        ORDER BY t.puntaje DESC, j.nombre_usuario ASC, j.id ASC
        LIMIT 10";

$res = $conn->query($sql);
if (!$res) {
    echo json_encode(['success' => false, 'mensaje' => 'Error: ' . $conn->error]);
    exit;
}

$ranking = [];
$posicion = 1;
while ($fila = $res->fetch_assoc()) {
    $ranking[] = [
        'posicion' => $posicion++,
        'nombre'   => $fila['nombre'],
        'puntaje'  => (int)$fila['puntaje']
    ];
}

echo json_encode(['success' => true, 'ranking' => $ranking]);
$conn->close();
?>
