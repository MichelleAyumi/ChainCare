package com.chaincare.chaincare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "pacientes", uniqueConstraints = {
        @UniqueConstraint(name = "cns_unique", columnNames = "cns"),
        @UniqueConstraint(name = "rg_unique", columnNames = "rg"),
        @UniqueConstraint(name = "cpf_unique", columnNames = "cpf")
})
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull
    @Column(name = "id")
    private Integer id = 0;

    @Size(max = 7,min = 7)
    @NotNull
    @Column(name = "cns", unique = true, nullable = false, length = 20)
    private String cns;

    @Size(max = 100)
    @NotNull
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Size(max = 255)
    @Column(name = "endereco")
    private String endereco;

    @NotNull
    @Size(max = 9,min = 9)
    @Column(name = "rg", nullable = false, unique = true, length = 20)
    private String rg;

    @NotNull
    @Size(max = 11,min = 11)
    @Column(name = "cpf", nullable = false, unique = true, length = 14)
    private String cpf;

    @Size(max = 20)
    @Column(name = "telefone", length = 20)
    private String telefone;

    @NotNull
    @Column(name = "sexo", length = 1, nullable = false)
    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    @NotNull
    @Column(name = "data_nasc", nullable = false)
    private LocalDate dataNasc;

    @Size(max = 50)
    @Column(name = "status", length = 50)
    private String status;

    @Size(max = 100)
    @Column(name = "convenio", length = 100)
    private String convenio;
}
