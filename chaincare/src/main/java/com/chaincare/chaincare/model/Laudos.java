package com.chaincare.chaincare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.awt.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "laudos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Laudos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull
    @Column(name = "id")
    private Integer id = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "PacienteID"))
    private Paciente paciente;

    @NotNull
    @Column(name = "nome_medico", nullable = false, length = 100)
    private String nomeMedico;

    @NotNull
    @Column(name = "data_hora_inicio", nullable = false)
    private LocalDateTime dataHoraInicio;

    @NotNull
    @Column(name = "data_hora_fim", nullable = false)
    private LocalDateTime dataHoraFim;

    @Column(name = "sintomas_relatados")
    private TextField sintomasRelatados;

    @Column(name = "diagnostico", columnDefinition = "TEXT")
    private TextField diagnostico;

    @Column(name = "tratamento_sugerido", columnDefinition = "TEXT")
    private TextField tratamentoSugerido;

    @Column(name = "remedio_receitado", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean remedioReceitado;

    @Column(name = "remedios")
    private String remedios;
}
