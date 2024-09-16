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