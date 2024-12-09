<?php


include('./conn_blockchain.php');

session_start();




if ($_POST['operacao'] == 'create') {
        
        $sql = "INSERT INTO laudos (id_laudo, data_hora_inicio_consulta, data_hora_fim_consulta, nome_medico, diagnostico, sintomas_relatados, tratamento_sugerido, block_hash) 
                VALUES (:PacienteID,  :DataHoraInicio, :DataHoraFim, :NomeMedico,  :Diagnostico, :SintomasRelatados, :TratamentoSugerido, :BlockHash)";
        $stmt = $pdo->prepare($sql);

        // Corrigindo o bindParam para corresponder aos nomes dos parâmetros no SQL
        $stmt->bindParam(':PacienteID', $_POST['PacienteID']);
        $stmt->bindParam(':NomeMedico', $_POST['NomeMedico']);
        $stmt->bindParam(':DataHoraInicio', $_POST['DataHoraInicio']);
        $stmt->bindParam(':DataHoraFim', $_POST['DataHoraFim']);
        $stmt->bindParam(':SintomasRelatados', $_POST['SintomasRelatados']);
        $stmt->bindParam(':Diagnostico', $_POST['Diagnostico']);
        $stmt->bindParam(':TratamentoSugerido', $_POST['TratamentoSugerido']);
        $stmt->bindParam(':BlockHash', $_POST['BlockHash']);  // Ajuste para o campo correto

        $stmt->execute();

        $result = array(
            'type' => 'success',
            'message' => 'Laudo cadastrado com sucesso'
        );
        echo json_encode($result);
    
}

if ($_POST['operacao'] == 'getCNS') {
    try {
        $cnsPaciente = $_POST['CNSPaciente'];  // Obter o CNS do paciente

        // SQL para buscar todos os dados da linha onde o CNS coincide
        $sql = "SELECT * FROM block WHERE cns = :CNSPaciente";  
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':CNSPaciente', $cnsPaciente);
        $stmt->execute();

        // Verifica se encontrou a linha e retorna todos os dados
        if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $result = array(
                'type' => 'success',
                'data' => $row  // Retorna toda a linha como um array
            );
        } else {
            // Caso o CNS não seja encontrado
            $result = array(
                'type' => 'error',
                'message' => 'CNS não encontrado na tabela de blocos.'
            );
        }

        echo json_encode($result);  // Retorna o resultado em formato JSON

    } catch (PDOException $e) {
        // Caso ocorra um erro na consulta
        $result = array(
            'type' => 'error',
            'message' => 'Erro: ' . $e->getMessage()
        );
        echo json_encode($result);  // Retorna o erro
    }
}


?>