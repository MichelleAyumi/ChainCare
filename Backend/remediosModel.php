<?php
include('./conn.php');

if ($_POST['operacao'] == 'create') {
    try {
        $sql = "INSERT INTO Remedios (Nome, Dosagem, FormaFarmaceutica) VALUES (:Nome, :Dosagem, :FormaFarmaceutica)";
        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':Nome', $_POST['Nome']);
        $stmt->bindParam(':Dosagem', $_POST['Dosagem']);
        $stmt->bindParam(':FormaFarmaceutica', $_POST['FormaFarmaceutica']);

        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Remédio cadastrado com sucesso'
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
        $sql = "SELECT * FROM Remedios";
        $resultado = $pdo->query($sql);
        $remedios = array();

        while ($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $remedios[] = $row;
        }

        echo json_encode($remedios);
    } catch (PDOException $e) {
        echo json_encode(array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        ));
    }
}

if ($_POST['operacao'] == 'delete') {
    try {
        $sql = "DELETE FROM Remedios WHERE ID = :ID";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':ID', $_POST['ID']);
        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Remédio excluído com sucesso'
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
