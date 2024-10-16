
CREATE TABLE Remedios (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100) NOT NULL UNIQUE, 
    Dosagem VARCHAR(50), 
    FormaFarmaceutica VARCHAR(50) 
);


