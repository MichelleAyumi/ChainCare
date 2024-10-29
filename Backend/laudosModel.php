<?php
include('./conn.php');

if ($_POST['operacao'] == 'getLaudos') {
    try {
        $cns = $_POST['CNS'];
        $sql = "SELECT * FROM Laudos WHERE PacienteID = (SELECT ID FROM Pacientes WHERE CNS = :cns)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':cns', $cns);
        $stmt->execute();
        $laudos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(array('laudos' => $laudos));
    } catch (PDOException $e) {
        echo json_encode(array('error' => 'Erro: ' . $e->getMessage()));
    }
}

if ($_POST['operacao'] == 'create') {
    try {
        $sql = "INSERT INTO Laudos (PacienteID, NomeMedico, DataHoraInicio, DataHoraFim, SintomasRelatados, Diagnostico, TratamentoSugerido, RemedioReceitado, Remedios) 
                VALUES (:PacienteID, :NomeMedico, :DataHoraInicio, :DataHoraFim, :SintomasRelatados, :Diagnostico, :TratamentoSugerido, :RemedioReceitado, :Remedios)";
        $stmt = $pdo->prepare($sql);

        $stmt->bindParam(':PacienteID', $_POST['PacienteID']);
        $stmt->bindParam(':NomeMedico', $_POST['NomeMedico']);
        $stmt->bindParam(':DataHoraInicio', $_POST['DataHoraInicio']);
        $stmt->bindParam(':DataHoraFim', $_POST['DataHoraFim']);
        $stmt->bindParam(':SintomasRelatados', $_POST['SintomasRelatados']);
        $stmt->bindParam(':Diagnostico', $_POST['Diagnostico']);
        $stmt->bindParam(':TratamentoSugerido', $_POST['TratamentoSugerido']);
        $stmt->bindParam(':RemedioReceitado', $_POST['RemedioReceitado']);
        $stmt->bindParam(':Remedios', $_POST['Remedios']);

        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Laudo cadastrado com sucesso'
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
        $sql = "SELECT * FROM Laudos";
        $resultado = $pdo->query($sql);
        $laudos = array();

        while ($row = $resultado->fetch(PDO::FETCH_ASSOC)) {
            $laudos[] = $row;
        }

        echo json_encode($laudos);
    } catch (PDOException $e) {
        echo json_encode(array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        ));
    }
}

if ($_POST['operacao'] == 'delete') {
    try {
        $sql = "DELETE FROM Laudos WHERE ID = :ID";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':ID', $_POST['ID']);
        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Laudo excluído com sucesso!'
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
