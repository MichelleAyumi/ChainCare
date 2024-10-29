<?php

include('./conn.php');

if (isset($_POST['query'])) {
    $query = $_POST['query'];
    
    try {
        // Definir o SQL e a variável de bind baseada na entrada
        if (is_numeric($query)) {
            $sqlPaciente = "SELECT * FROM Pacientes WHERE CNS = :query";
            $queryParam = $query;  // CNS numérico
        } else {
            $sqlPaciente = "SELECT * FROM Pacientes WHERE Nome LIKE :query";
            $queryParam = '%' . $query . '%';  // Nome com wildcard
        }

        $stmtPaciente = $pdo->prepare($sqlPaciente);
        $stmtPaciente->bindParam(':query', $queryParam);
        $stmtPaciente->execute();
        $paciente = $stmtPaciente->fetch(PDO::FETCH_ASSOC);

        if (!$paciente) {
            echo json_encode(array('error' => 'Paciente não encontrado.'));
            exit;
        }

        // Busca os laudos do paciente usando o ID encontrado
        $sqlLaudos = "SELECT * FROM Laudos WHERE PacienteID = :pacienteId";
        $stmtLaudos = $pdo->prepare($sqlLaudos);
        $stmtLaudos->bindParam(':pacienteId', $paciente['ID']);
        $stmtLaudos->execute();
        $laudos = $stmtLaudos->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(array('paciente' => $paciente, 'laudos' => $laudos));
    } catch (PDOException $e) {
        echo json_encode(array('error' => 'Erro no banco de dados: ' . $e->getMessage()));
    }
} else {
    echo json_encode(array('error' => 'Parâmetro de pesquisa ausente.'));
}
