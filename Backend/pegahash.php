<?php

//include('./conn_blockchain.php');

//session_start();

function getHashByCNS($cns) {
    try {
        // Consulta para buscar o hash no banco e tabela especificados
        $sql = "SELECT hash FROM blockchain.block WHERE cns = :CNS"; // Especifica o banco diretamente na query
        $stmt = $pdo->prepare($sql); // Usa a conexão existente
        $stmt->bindParam(':CNS', $cns, PDO::PARAM_STR);
        $stmt->execute();
    
        // Verifica se encontrou a linha e retorna o valor do hash
        if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            return $row['hash']; // Retorna apenas o hash
        } else {
            // Caso o CNS não seja encontrado
            return 'CNS não encontrado na tabela block.';
        }
    } catch (PDOException $e) {
        // Caso ocorra um erro na consulta
        return 'Erro: ' . $e->getMessage();
    }
    
}

