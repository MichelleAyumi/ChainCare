<?php
session_start();
include('./conn.php');

if ($_POST['operacao'] == 'login') {
    $login = $_POST['login'];
    $senha = $_POST['senha'];
    $tipo_usuario = $_POST['tipo_usuario'];

    $sql = "SELECT * FROM Usuarios WHERE login = :login AND senha = :senha AND tipo_usuario = :tipo_usuario";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':login', $login);
    $stmt->bindParam(':senha', $senha);
    $stmt->bindParam(':tipo_usuario', $tipo_usuario);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $_SESSION['logado'] = true;
        $_SESSION['login'] = $_POST['login'];
        $_SESSION['tipo_usuario'] = $user['tipo_usuario'];

        echo json_encode(array('type' => 'success', 'message' => 'Login bem-sucedido'));
    } else {
        echo json_encode(array('type' => 'error', 'message' => 'Credenciais incorretas'));
    }
}
?>
