$(document).ready(function() {
    // Função para buscar os laudos do paciente
    function searchPatient() {
        const searchQuery = $('#patientSearch').val().trim();

        if (!searchQuery) {
            alert('Por favor, insira o CNS ou o nome do paciente.');
            return;
        }

        $.ajax({
            url: '../Backend/buscarPacienteLaudos.php',
            type: 'POST',
            data: { query: searchQuery },
            dataType: 'json',
            success: function(response) {
                if (response.error) {
                    alert(response.error);
                    $('#patientReport').hide();
                    return;
                }

                if (response.laudos && response.laudos.length > 0) {
                    // Ordena laudos pela data, mais recente primeiro
                    response.laudos.sort((a, b) => new Date(b.DataHoraInicio) - new Date(a.DataHoraInicio));
                    const paciente = response.paciente;
                    const ultimoLaudo = response.laudos[0];
                    $('#consultationDate').text(`${ultimoLaudo.DataHoraInicio} - ${ultimoLaudo.DataHoraFim}`);
                    $('#clinicName').text(ultimoLaudo.NomeClinica || 'Não informado');
                    $('#insurance').text(paciente.Convenio || 'Não informado');
                    $('#reportDoctor').text(ultimoLaudo.NomeMedico);
                    $('#symptoms').text(ultimoLaudo.SintomasRelatados);
                    $('#treatment').text(ultimoLaudo.TratamentoSugerido);
                    $('#medication').text(ultimoLaudo.Remedios || 'Nenhum');

                    $('#patientReport').show();

                    // Exibir todos os laudos (menos o último)
                    let laudosHTML = '';
                    response.laudos.slice(1).forEach(laudo => {
                        laudosHTML += `
                            <div class="laudo">
                                <hr>
                                <p><strong>Data da Consulta:</strong> ${laudo.DataHoraInicio} - ${laudo.DataHoraFim}</p>
                                <p><strong>Nome da Clínica:</strong> ${laudo.NomeClinica || 'Não informado'}</p>
                                <p><strong>Convênio:</strong> ${paciente.Convenio || 'Não informado'}</p>
                                <p><strong>Médico:</strong> ${laudo.NomeMedico}</p>
                                <p><strong>Sintomas Relatados:</strong> ${laudo.SintomasRelatados}</p>
                                <p><strong>Diagnóstico:</strong> ${laudo.Diagnostico}</p>
                                <p><strong>Tratamento Sugerido:</strong> ${laudo.TratamentoSugerido}</p>
                                <p><strong>Remédio Receitado:</strong> ${laudo.RemedioReceitado}</p>
                                <p><strong>Remédios:</strong> ${laudo.Remedios || 'Nenhum'}</p>
                            </div>
                        `;
                    });
                    $('#allReports').html(laudosHTML);
                } else {
                    alert('Nenhum laudo encontrado para este paciente.');
                    $('#patientReport').hide();
                    $('#allReports').empty();
                }
            },
            error: function() {
                alert('Erro ao buscar informações do paciente');
            }
        });
    }

    // Função de logout
    function logout() {
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
    }

    // Associar funções aos botões
    $('#searchPatientBtn').click(searchPatient);
    $('#logoutBtn').click(logout);
});
