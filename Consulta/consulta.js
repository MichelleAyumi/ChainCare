$(document).ready(function() {
    // Função para carregar pacientes no select
    function carregarPacientes() {
        $.ajax({
            url: '../Backend/pacientesModel.php',
            type: 'POST',
            data: { operacao: 'read' },
            dataType: 'json',
            success: function(response) {
                $('#paciente').empty().append('<option value="">Selecione o paciente</option>');
                $.each(response, function(index, paciente) {
                    $('#paciente').append(`<option value="${paciente.ID}">${paciente.Nome}</option>`);
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
            NomeMedico: 'Dr. Exemplo',  // Nome do médico fixo ou dinâmico conforme necessidade
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
});
