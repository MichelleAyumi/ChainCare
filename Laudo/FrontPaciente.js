$(document).ready(function() {
    // Função para verificar a sessão do usuário ao carregar a página
    function verificarSessao() {
        $.ajax({
            url: '../Backend/verificar_sessao.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (!response.logado || response.tipo_usuario !== 'paciente') {
                    alert('Sessão expirada ou acesso não autorizado.');
                    window.location.href = '../Login/index.html';
                } else {
                    carregarInformacoesPaciente();
                }
            },
            error: function() {
                alert('Erro ao verificar a sessão');
            }
        });
    }

    // Função para carregar informações do paciente e laudos
    function carregarInformacoesPaciente() {
        $.ajax({
            url: '../Backend/pacientesModel.php',
            type: 'POST',
            data: { operacao: 'getPacienteInfo' },
            dataType: 'json',
            success: function(response) {
                if (response.paciente) {
                    const paciente = response.paciente;
                    // Preencher informações do paciente
                    $('.patient-info td').each(function(index) {
                        $(this).text(paciente[$(this).attr('data-key')]);
                    });
                } else {
                    alert('Paciente não encontrado');
                }
                
                // Carregar laudos do paciente
                carregarLaudosPaciente();
            },
            error: function() {
                alert('Erro ao carregar informações do paciente');
            }
        });
    }

    // Função para carregar laudos do paciente
    function carregarLaudosPaciente() {
        $.ajax({
            url: '../Backend/laudosModel.php',
            type: 'POST',
            data: { operacao: 'getLaudos', CNS: $('#paciente-cns').text() },
            dataType: 'json',
            success: function(response) {
                if (response.laudos) {
                    let laudosHTML = '';
                    response.laudos.forEach(laudo => {
                        laudosHTML += `
                            <table class="laudo">
                                <tr><th>Início do Atendimento</th><td>${laudo.DataHoraInicio}</td></tr>
                                <tr><th>Término do Atendimento</th><td>${laudo.DataHoraFim}</td></tr>
                                <tr><th>Nome do Médico</th><td>${laudo.NomeMedico}</td></tr>
                                <tr><th>Sintomas Relatados</th><td>${laudo.SintomasRelatados}</td></tr>
                                <tr><th>Diagnóstico</th><td>${laudo.Diagnostico}</td></tr>
                                <tr><th>Tratamento Sugerido</th><td>${laudo.TratamentoSugerido}</td></tr>
                                <tr><th>Remédio Receitado</th><td>${laudo.RemedioReceitado}</td></tr>
                                <tr><th>Remédios</th><td>${laudo.Remedios}</td></tr>
                            </table>
                            <br>
                        `;
                    });
                    $('.exam-results').html(laudosHTML);
                } else {
                    $('.exam-results').html('<p>Sem laudos disponíveis</p>');
                }
            },
            error: function() {
                alert('Erro ao carregar laudos');
            }
        });
    }

    // Função para fazer logout
    $('#logoutBtn').click(function() {
        $.ajax({
            url: '../Backend/logout.php',
            type: 'POST',
            success: function() {
                window.location.href = '../Login/index.html';
            },
            error: function() {
                alert('Erro ao sair da sessão');
            }
        });
    });

    // Inicializar verificação de sessão
    verificarSessao();
});
