<?php
include('./conn.php');

session_start();

if ($_POST['operacao'] == 'getPacienteInfo') {
    try {
        $cns = $_SESSION['login'];
        $sql = "SELECT * FROM Pacientes WHERE CNS = :cns";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':cns', $cns);
        $stmt->execute();
        $paciente = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode(array('paciente' => $paciente));
    } catch (PDOException $e) {
        echo json_encode(array('error' => 'Erro: ' . $e->getMessage()));
    }
}

if ($_POST['operacao'] == 'create') {
    try {
        $sql = "INSERT INTO Pacientes (CNS, Nome, Endereco, RG, CPF, Telefone, Sexo, Data_Nasc, Status, Convenio) 
                VALUES (:CNS, :Nome, :Endereco, :RG, :CPF, :Telefone, :Sexo, :Data_Nasc, :Status, :Convenio)";
        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':CNS', $_POST['CNS']);
        $stmt->bindParam(':Nome', $_POST['Nome']);
        $stmt->bindParam(':Endereco', $_POST['Endereco']);
        $stmt->bindParam(':RG', $_POST['RG']);
        $stmt->bindParam(':CPF', $_POST['CPF']);
        $stmt->bindParam(':Telefone', $_POST['Telefone']);
        $stmt->bindParam(':Sexo', $_POST['Sexo']);
        $stmt->bindParam(':Data_Nasc', $_POST['Data_Nasc']);
        $stmt->bindParam(':Status', $_POST['Status']);
        $stmt->bindParam(':Convenio', $_POST['Convenio']);

        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Paciente cadastrado com sucesso'
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
        $sql = "SELECT * FROM Pacientes";
        $resultado = $pdo->query($sql);
        $pacientes = array();

        while ($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $pacientes[] = $row;
        }

        echo json_encode($pacientes);
    } catch (PDOException $e) {
        echo json_encode(array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        ));
    }
}

if ($_POST['operacao'] == 'delete') {
    try {
        $sql = "DELETE FROM Pacientes WHERE ID = :ID";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':ID', $_POST['ID']);
        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Paciente excluído com sucesso!'
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
