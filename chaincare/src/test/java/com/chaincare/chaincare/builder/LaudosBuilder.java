package com.chaincare.chaincare.builder;

import com.chaincare.chaincare.model.Laudos;
import com.chaincare.chaincare.repository.PacienteRepository;

import java.time.LocalDateTime;

public class LaudosBuilder {
    Laudos laudos;

    public static LaudosBuilder build() {
        LaudosBuilder builder = new LaudosBuilder();
        builder.laudos = new Laudos();
        builder.laudos.setDataHoraFim(LocalDateTime.now());
        builder.laudos.setDataHoraInicio(LocalDateTime.now());
        builder.laudos.setNomeMedico("Dr. Fulano");

        return builder;
    }

    public LaudosBuilder addPaciente (PacienteRepository pacienteRepository) {
        laudos.setPaciente(pacienteRepository.findAll().getFirst());
        return this;
    }

    public Laudos now () {
        return laudos;
    }
}
