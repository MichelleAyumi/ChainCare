<?php
include('./conn.php');
include('./pegahash.php');

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


if ($_POST['operacao'] == 'getPaciente') {
    try {
        // Recebe o ID do paciente e dados do laudo enviados pelo AJAX
        $pacienteID = $_POST['PacienteID'];
        $laudoData = $_POST['laudoData']; // Certifique-se que esta variável é um array e contém todas as chaves necessárias

        // Consulta SQL para buscar o paciente pelo ID
        $sql = "SELECT * FROM Pacientes WHERE ID = :PacienteID";  // Usando a coluna ID
        $stmt = $pdo->prepare($sql);

        // Substitui o marcador :PacienteID pelo valor enviado
        $stmt->bindParam(':PacienteID', $pacienteID);
        $stmt->execute();

        // Busca o resultado (um paciente ou nenhum)
        $paciente = $stmt->fetch(PDO::FETCH_ASSOC);

        $cns = $paciente['CNS']; // Supondo que o CNS está em $paciente

        $sql2 = "SELECT hash FROM blockchain.block WHERE cns = :CNS"; // Especifica o banco diretamente na query
        $stmt2 = $pdo->prepare($sql2); // Usa a conexão existente
        $stmt2->bindParam(':CNS', $cns, PDO::PARAM_STR);
        $stmt2->execute();

        // Verifica se encontrou a linha e retorna o valor do hash
        if ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
            $hash = $row['hash']; // Retorna apenas o hash
        } else {
            // Caso o CNS não seja encontrado
            echo json_encode(array('success' => false, 'message' => 'CNS não encontrado na tabela block.'));
            exit;
        }

        // Verifica se encontrou o paciente
        if ($paciente) {
            // Prepara os dados para enviar via AJAX
            $dados = array(
                'data_hora_inicio_consulta' => $laudoData['data_hora_inicio_consulta'],
                'data_hora_fim_consulta' => $laudoData['data_hora_fim_consulta'],
                'nome_medico' => $laudoData['nome_medico'],
                'diagnostico' => $laudoData['diagnostico'],
                'sintomas_relatados' => $laudoData['sintomas_relatados'],
                'tratamento_sugerido' => $laudoData['tratamento_sugerido'],
                'block_hash' => $hash
            );

            $dados_json = json_encode($dados);

            $sql3 = "INSERT INTO laudos (id_laudo, data_hora_inicio_consulta, data_hora_fim_consulta, nome_medico, diagnostico, sintomas_relatados, tratamento_sugerido, block_hash) 
                VALUES (default, :data_hora_inicio_consulta, :data_hora_fim_consulta, :nome_medico, :diagnostico, :sintomas_relatados, :tratamento_sugerido, :block_hash)";
            $stmt3 = $pdo->prepare($sql3);

            $stmt3->bindParam(':data_hora_inicio_consulta', $dados['data_hora_inicio_consulta']);
            $stmt3->bindParam(':data_hora_fim_consulta', $dados['data_hora_fim_consulta']);
            $stmt3->bindParam(':nome_medico', $dados['nome_medico']);
            $stmt3->bindParam(':diagnostico', $dados['diagnostico']);
            $stmt3->bindParam(':sintomas_relatados', $dados['sintomas_relatados']);
            $stmt3->bindParam(':tratamento_sugerido', $dados['tratamento_sugerido']);
            $stmt3->bindParam(':block_hash', $dados['block_hash']);
            $stmt3->execute();
            
            echo json_encode(array('success' => true, 'paciente' => $paciente, 'hash' => $hash, 'd' => $dados_json,'cns' => $cns));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Paciente não encontrado.'));
        }
    } catch (PDOException $e) {
        // Em caso de erro no banco de dados, captura a exceção
        echo json_encode(array('success' => false, 'error' => 'Erro: ' . $e->getMessage()));
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
