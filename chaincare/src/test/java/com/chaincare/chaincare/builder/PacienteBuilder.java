package com.chaincare.chaincare.builder;

import com.chaincare.chaincare.model.Paciente;

import java.time.LocalDate;

public class PacienteBuilder {
    Paciente paciente;

    public static PacienteBuilder build() {
        PacienteBuilder builder = new PacienteBuilder();
        builder.paciente = new Paciente();
        builder.paciente.setCns("123456");
        builder.paciente.setRg("123456");
        builder.paciente.setCpf("123456");
        builder.paciente.setNome("Lívia");
        builder.paciente.setSexo('F');
        builder.paciente.setDataNasc(LocalDate.now());
        return builder;
    }

    public PacienteBuilder addNome(String name) {
        paciente.setNome(name);
        return this;
    }

    public Paciente now () {
        return paciente;
    }
}
