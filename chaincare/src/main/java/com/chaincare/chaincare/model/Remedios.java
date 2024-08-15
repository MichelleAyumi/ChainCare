package com.chaincare.chaincare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "remedios")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Remedios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull
    @Column(name = "id")
    private Integer id = 0;

    @Size(max = 100)
    @NotNull
    @Column(name = "nome", nullable = false, length = 100, unique = true)
    private String nome;

    @Size(max = 50)
    @Column(name = "dosagem", length = 50)
    private String dosagem;

    @Size(max = 50)
    @Column(name = "forma_farmaceutica", length = 50)
    private String formaFarmaceutica;
}
