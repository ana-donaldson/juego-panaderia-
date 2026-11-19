<?php
$host = "localhost";
$usuario = "root";
$contraseña = "";
$base_datos = "panaderia_db";

$conn = new mysqli($host, $usuario, $contraseña, $base_datos);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Proveedores de correo permitidos (lista cerrada). Mantener sincronizada con login.js
function dominioCorreoPermitido($email) {
    $permitidos = [
        'gmail.com', 'googlemail.com',
        'outlook.com', 'outlook.es', 'outlook.com.ar',
        'hotmail.com', 'hotmail.es', 'hotmail.com.ar',
        'live.com', 'msn.com',
        'yahoo.com', 'yahoo.es', 'yahoo.com.ar',
        'icloud.com', 'me.com',
        'aol.com',
        'proton.me', 'protonmail.com'
    ];
    $pos = strrpos($email, '@');
    if ($pos === false) return false;
    return in_array(strtolower(substr($email, $pos + 1)), $permitidos, true);
}
?>

