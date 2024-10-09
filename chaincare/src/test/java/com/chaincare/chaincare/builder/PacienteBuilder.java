package com.chaincare.chaincare.builder;

import com.chaincare.chaincare.model.Paciente;
import com.chaincare.chaincare.model.Sexo;

import java.time.LocalDate;

public class PacienteBuilder {
    Paciente paciente;

    public static PacienteBuilder build() {
        PacienteBuilder builder = new PacienteBuilder();
        builder.paciente = new Paciente();
        builder.paciente.setNome("Lívia");
        builder.paciente.setSexo(Sexo.F);
        builder.paciente.setDataNasc(LocalDate.now());
        return builder;
    }

    public Paciente now () {
        return paciente;
    }
}
