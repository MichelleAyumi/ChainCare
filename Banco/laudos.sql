
CREATE TABLE Laudos (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    PacienteID INT,
    NomeMedico VARCHAR(100) NOT NULL,
    DataHoraInicio DATETIME NOT NULL,
    DataHoraFim DATETIME NOT NULL,
    SintomasRelatados TEXT,
    Diagnostico TEXT,
    TratamentoSugerido TEXT,
    RemedioReceitado BOOLEAN DEFAULT FALSE,
    Remedios VARCHAR(255),
    FOREIGN KEY (PacienteID) REFERENCES Pacientes(ID)
);

