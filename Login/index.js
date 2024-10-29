var formMedico = document.querySelector('#medico')
var formPaciente = document.querySelector('#paciente')
var btnColor = document.querySelector('.btnColor')

document.querySelector('#btnMedico')
    .addEventListener('click', () =>{
        formMedico.style.left = "25px" 
        formPaciente.style.left = "450px"
        btnColor.style.left = "0px"

})

document.querySelector('#btnPaciente')
    .addEventListener('click', () =>{
        formMedico.style.left = "-450px" 
        formPaciente.style.left = "25px"
        btnColor.style.left = "120px"

})

$(document).ready(function() {
    // Função para verificar a sessão ao carregar a página
    function verificarSessao() {
        $.ajax({
            url: '../Backend/verificar_sessao.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.logado) {
                    if (response.tipo_usuario === 'medico') {
                        window.location.href = '../Laudo/FrontMedico.html';
                    } else if (response.tipo_usuario === 'paciente') {
                        window.location.href = '../Laudo/FrontPaciente.html';
                    }
                }
            },
            error: function() {
                console.log('Erro ao verificar a sessão.');
            }
        });
    }

    // Chama a verificação da sessão ao carregar
    verificarSessao();

    // Função de login para médico
    $('#medico').submit(function(e) {
        e.preventDefault();
        const loginData = {
            operacao: 'login',
            tipo_usuario: 'medico',
            login: $('#medico input[type="text"]').val(),
            senha: $('#medico input[type="password"]').val()
        };

        realizarLogin(loginData);
    });

    // Função de login para paciente
    $('#paciente').submit(function(e) {
        e.preventDefault();
        const loginData = {
            operacao: 'login',
            tipo_usuario: 'paciente',
            login: $('#paciente input[type="text"]').val(),
            senha: $('#paciente input[type="password"]').val()
        };

        realizarLogin(loginData);
    });

    // Função genérica para realizar o login
    function realizarLogin(loginData) {
        $.ajax({
            url: '../Backend/login.php',
            type: 'POST',
            data: loginData,
            dataType: 'json',
            success: function(response) {
                if (response.type === 'success') {
                    if (loginData.tipo_usuario === 'medico') {
                        window.location.href = '../Laudo/FrontMedico.html';
                    } else if (loginData.tipo_usuario === 'paciente') {
                        window.location.href = '../Laudo/FrontPaciente.html';
                    }
                } else {
                    alert(response.message);
                }
            },
            error: function() {
                alert('Erro ao realizar login');
            }
        });
    }
});