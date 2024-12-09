$(document).ready(function() {

        function carregarPacientes() {
            $.ajax({
                url: '../Backend/pacientesModel.php',
                type: 'POST',
                data: { operacao: 'read' },
                dataType: 'json',
                success: function(response) {
                    // Limpar o select e adicionar a opção padrão
                    $('#paciente').empty().append('<option value="">Selecione o paciente</option>');
                    
                    // Iterar sobre os pacientes recebidos da resposta
                    $.each(response, function(index, paciente) {
                        // Adicionar as opções de pacientes no select
                        $('#paciente').append(`<option value="${paciente.ID}" data-cns="${paciente.CNS}">${paciente.Nome}</option>`);
                    });
        
                    // Quando um paciente for selecionado
                    $('#paciente').change(function() {
                        // Obter o CNS do paciente selecionado
                        const cns = $(this).find(':selected').data('cns');
        
                        // Se o CNS estiver presente, criar um input hidden com o CNS
                        if (cns) {
                            // Verificar se o input hidden já existe, se não, cria um novo
                            if ($('#cnsPaciente').length === 0) {
                                // Criar o input hidden para o CNS
                                $('<input>').attr({
                                    type: 'hidden',
                                    id: 'cnsPaciente',
                                    name: 'cns',
                                    value: cns
                                }).appendTo('form');
                            } else {
                                // Atualizar o valor do input hidden existente
                                $('#cnsPaciente').val(cns);
                            }
                        }
                    });
                },
                error: function() {
                    alert('Erro ao carregar pacientes');
                }
            });
        }
        

    // Função para formatar a data em 'YYYY-MM-DD HH:MM:SS'
    function formatarDataParaSQL(data) {
        return data.toISOString().slice(0, 19).replace('T', ' ');
    }

    // Chamada para carregar os pacientes ao carregar a página
    carregarPacientes();

    // Função para salvar o laudo
    $('#salvarBtn').click(function() {
        const dataAtual = new Date();
        
        const laudoData = {
            operacao: 'create',
            PacienteID: $('#paciente').val(),
            //NomeMedico: 'Dr. Exemplo',  // Nome do médico fixo ou dinâmico conforme necessidade
            DataHoraInicio: formatarDataParaSQL(dataAtual),
            DataHoraFim: formatarDataParaSQL(dataAtual),
            SintomasRelatados: $('#symptoms').val(),
            Diagnostico: $('#diagnostic').val(),
            TratamentoSugerido: $('#treatment').val(),
            RemedioReceitado: parseInt($('#boolmedicine').val()),
            Remedios: $('#medicine').val()
        };

        if (!laudoData.PacienteID) {
            alert('Por favor, selecione um paciente');
            return;
        }
        
        $.ajax({
            url: '../Backend/laudosModel.php',
            type: 'POST',
            data: laudoData,
            dataType: 'json',
            success: function(response) {
                if (response.type === 'success') {
                    alert(response.message);
                    $('#laudoForm')[0].reset();
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Erro ao salvar o laudo');
            }
        });
    });


    $('#blockchainBtn').click(function() {


        const pacienteID = $('#paciente').val();  // Pega o ID do paciente selecionado
        let cnsPaciente = "";
        var cnsSelecionado = $('#paciente option:selected').data('cns');

        // alert(cnsSelecionado)

        const dataAtual = new Date();
                    // Cria o objeto com os dados necessários para enviar para a nova rota
                    const laudoData = {
                        data_hora_inicio_consulta: formatarDataParaSQL(dataAtual),
                        data_hora_fim_consulta: formatarDataParaSQL(dataAtual),
                        nome_medico: 'Dr. John Doe',
                        diagnostico: $('#diagnostic').val(),
                        sintomas_relatados: $('#symptoms').val(),
                        tratamento_sugerido: $('#treatment').val(),
                        block_hash: '0000000000'
                    };

                    // alert(JSON.stringify(laudoData));
    
                    $.ajax({
                        url: 'http://localhost:3001/' + cnsSelecionado + '/novo-laudo',  // Aqui, cnsSelecionado vai para a URL corretamente
                        type: 'PUT',
                        contentType: 'application/json', // Defina o tipo de conteúdo para JSON
                        data: JSON.stringify({
                            data_hora_inicio_consulta: formatarDataParaSQL(dataAtual),
                        data_hora_fim_consulta: formatarDataParaSQL(dataAtual),
                        nome_medico: 'Dr. John Doe',
                        diagnostico: $('#diagnostic').val(),
                        sintomas_relatados: $('#symptoms').val(),
                        tratamento_sugerido: $('#treatment').val(),
                        block_hash: '0000000000'
                        }),
                        dataType: 'json',  // Espera uma resposta JSON
                        success: function(response) {
                            console.log(response);  // Depura a resposta do primeiro AJAX
                            if (response.success) {
                                alert('Deu certo!');
                            } else {
                                alert('Erro: ' + response.message);  // Exibe erro caso o paciente não seja encontrado
                            }
                        },
                        error: function() {
                            alert('Erro ao buscar o paciente.');  // Exibe erro caso a requisição falhe
                        }
                    });

       
    });

async function retornaHashPaciente(cnsPaciente) {
    try {
        const response = await $.ajax({
            url: '../Backend/blockModel.php',
            type: 'POST',
            data: { 
                operacao: 'getCNS', 
                CNSPaciente: cnsPaciente  // Envia o CNS do paciente
            },
            dataType: 'json'
        });

        console.log(response);  // Depura a resposta do segundo AJAX

        if (response.type === 'success') {
            const blockHash = response.hash;
            console.log('Block Hash:', blockHash);
            window.location = "www.google.com"
            alert('Block Hash: ' + blockHash);  // Exibe o block hash
        } else {
            alert('Erro: ' + response.message);  // Exibe erro caso o hash não seja encontrado
        }
    } catch (error) {
        alert('Erro ao carregar o block hash');  // Exibe erro caso a requisição falhe
        console.error(error);
    }
}

    
    
});
