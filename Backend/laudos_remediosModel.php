<?php
include('./conn.php');

if ($_POST['operacao'] == 'create') {
    try {
        $sql = "INSERT INTO LaudosRemedios (LaudoID, RemedioID) VALUES (:LaudoID, :RemedioID)";
        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':LaudoID', $_POST['LaudoID']);
        $stmt->bindParam(':RemedioID', $_POST['RemedioID']);

        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Associação entre laudo e remédio cadastrada com sucesso'
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
        $sql = "SELECT * FROM LaudosRemedios";
        $resultado = $pdo->query($sql);
        $associacoes = array();

        while ($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $associacoes[] = $row;
        }

        echo json_encode($associacoes);
    } catch (PDOException $e) {
        echo json_encode(array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        ));
    }
}

if ($_POST['operacao'] == 'delete') {
    try {
        $sql = "DELETE FROM LaudosRemedios WHERE LaudoID = :LaudoID AND RemedioID = :RemedioID";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':LaudoID', $_POST['LaudoID']);
        $stmt->bindParam(':RemedioID', $_POST['RemedioID']);
        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Associação entre laudo e remédio excluída com sucesso'
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
