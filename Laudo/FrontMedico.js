function searchPatient() {
    // Simulated patient data retrieval
    document.getElementById('patientReport').style.display = 'block';
    document.getElementById('consultationDate').innerText = '01/01/2023 - 01/02/2023';
    document.getElementById('clinicName').innerText = 'Health Clinic';
    document.getElementById('insurance').innerText = 'Health Insurance Co.';
    document.getElementById('reportDoctor').innerText = 'Dr. John Doe';
    document.getElementById('symptoms').innerText = 'Chest Pain';
    document.getElementById('treatment').innerText = 'Rest and Medication';
    document.getElementById('medication').innerText = 'Aspirin';
}

function logout() {
    // Logout functionality
    alert('You have logged out.');
}