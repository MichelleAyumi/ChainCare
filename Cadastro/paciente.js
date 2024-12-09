$(document).ready(function () {
    $('#registerBtn').click(function (e) {
        e.preventDefault();

        $.ajax({
            url: '../Backend/pacientesModel.php',
            type: 'POST',
            data: {
                operacao: 'create',
                Nome: $('#name').val(),
                Endereco: $('#address').val(),
                CNS: $('#cns').val(),
                RG: $('#rg').val(),
                CPF: $('#cpf').val(),
                Telefone: $('#phone').val(),
                Sexo: $('#gender').val(),
                Data_Nasc: $('#dob').val(),
                Status: $('#status').val(),
                Convenio: $('#insurance').val()
            },
            success: function (response) {
                const result = JSON.parse(response);
                alert(result.message);
            },
            error: function () {
                alert("Erro ao tentar cadastrar o paciente.");
            }
        });
    });

    $('#blockchainBtn').click(function (e) {
        e.preventDefault();

        const cns = $('#cns').val();

        console.log(cns);
        $.ajax({
            url: `http://localhost:3001/${cns}/novo-paciente`,  
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({}),  
            success: function (response) {
                alert('Paciente salvo na blockchain com sucesso!');
            },
            error: function () {
                alert("Erro ao salvar paciente na blockchain.");
            }
        });
    });
    

    
    
});