<?php
header('Content-Type: application/json; charset=utf-8');
include 'conexion.php';
$conn->set_charset('utf8mb4');

// Función para obtener el Top 10 de una tabla específica
function obtenerRanking($conn, $tabla) {
    $sql = "SELECT j.nombre_usuario AS nombre, MAX(p.puntuacion) AS puntaje
            FROM $tabla p
            JOIN jugadores j ON j.id = p.jugador_id
            GROUP BY j.id, j.nombre_usuario
            ORDER BY puntaje DESC, j.nombre_usuario ASC
            LIMIT 10";
    
    $res = $conn->query($sql);
    $ranking = [];
    if ($res) {
        $posicion = 1;
        while ($fila = $res->fetch_assoc()) {
            $ranking[] = [
                'posicion' => $posicion++,
                'nombre'   => $fila['nombre'],
                'puntaje'  => (int)$fila['puntaje']
            ];
        }
    }
    return $ranking;
}

// Obtener ambas tablas
$rankingCajero = obtenerRanking($conn, 'partidas_cajero');
$rankingCocinero = obtenerRanking($conn, 'partidas_cocinero');

echo json_encode([
    'success' => true, 
    'ranking_cajero' => $rankingCajero,
    'ranking_cocinero' => $rankingCocinero
]);

$conn->close();
?>