<?php
include('./conn.php');

if ($_POST['operacao'] == 'create') {
    try {
        $sql = "INSERT INTO Usuarios (login, tipo_usuario, senha) 
                VALUES (:login, :tipo_usuario, :senha)";
        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':login', $_POST['login']);
        $stmt->bindParam(':tipo_usuario', $_POST['tipo_usuario']);
        $stmt->bindParam(':senha', $_POST['senha']);

        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Usuário cadastrado com sucesso'
        );
        echo json_encode($result);
    } catch (PDOException $e) {
        $result = array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        );
        echo json_encode($result);
    }
}

if ($_POST['operacao'] == 'read') {
    try {
        $sql = "SELECT * FROM Usuarios";
        $resultado = $pdo->query($sql);
        $usuarios = array();

        while ($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $usuarios[] = $row;
        }

        echo json_encode($usuarios);
    } catch (PDOException $e) {
        echo json_encode(array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        ));
    }
}

if ($_POST['operacao'] == 'delete') {
    try {
        $sql = "DELETE FROM Usuarios WHERE login = :login";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':login', $_POST['login']);
        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Usuário excluído com sucesso!'
        );
        echo json_encode($result);
    } catch (PDOException $e) {
        $result = array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        );
        echo json_encode($result);
    }
}
?>
