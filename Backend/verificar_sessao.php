<?php
session_start();

if (isset($_SESSION['logado']) && $_SESSION['logado'] === true) {
    echo json_encode(array('logado' => true, 'tipo_usuario' => $_SESSION['tipo_usuario']));
} else {
    echo json_encode(array('logado' => false));
}
?>
