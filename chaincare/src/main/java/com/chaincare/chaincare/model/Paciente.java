package com.chaincare.chaincare.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Table(name = "pacientes")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Paciente {
    @Id
    @Column(name = "id", nullable = false, columnDefinition = "PRIMARY KEY AUTO_INCREMENT")
    private Integer id;

    @Size(max = 20)
    @NotNull
    @Column(name = "cns", nullable = false, length = 20)
    private String cns;

    @Size(max = 100)
    @NotNull
    @Column(name = "nome", nullable = false, unique = true, length = 100)
    private String nome;

    @Size(max = 255)
    @Column(name = "endereco")
    private String endereco;

    @NotNull
    @Size(max = 20)
    @Column(name = "rg", nullable = false, unique = true, length = 20)
    private String rg;

    @NotNull
    @Size(max = 14)
    @Column(name = "cpf", nullable = false, unique = true, length = 14)
    private String cpf;

    @NotNull
    @Size(max = 20)
    @Column(name = "telefone", nullable = false, length = 20)
    private String telefone;

    @NotNull
    @Column(name = "data_nasc", nullable = false)
    private LocalDate dataNasc;

    @NotNull
    @Column(name = "sexo", nullable = false, length = 1, columnDefinition = "CHECK (Sexo IN ('M', 'F'))")
    private Character sexo;

    @Size(max = 50)
    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Size(max = 100)
    @Column(name = "convenio", nullable = false, length = 100)
    private String convenio;
}
