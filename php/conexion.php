<?php
$host = "localhost";
$usuario = "root";
$contraseña = "";
$base_datos = "panaderia_db";

$conn = new mysqli($host, $usuario, $contraseña, $base_datos);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>