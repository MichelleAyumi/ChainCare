package com.chaincare.chaincare.repository;

import com.chaincare.chaincare.builder.PacienteBuilder;
import com.chaincare.chaincare.model.Paciente;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PacienteRepositoryTest {
    @Autowired
    PacienteRepository pacienteRepository;

    @Test
    @Order(1)
    void save () {
        Paciente savedPaciente = pacienteRepository.save(PacienteBuilder.build().now());
        assertNotNull(savedPaciente);
    }

    @Test
    @Order(2)
    void load () {
        Paciente savedPaciente = pacienteRepository.save(PacienteBuilder.build().now());
        assertNotNull(savedPaciente);

        Optional<Paciente> loadedPaciente = pacienteRepository.findById(savedPaciente.getId());
        assertNotNull(loadedPaciente);
    }

    @Test
    @Order(3)
    void loadAll () {
        List<Paciente> users = pacienteRepository.findAll();
        assertNotNull(users);
    }

    @Test
    @Order(4)
    void update () {
        Paciente savedPaciente = pacienteRepository.save(PacienteBuilder.build().now());
        assertNotNull(savedPaciente);

        savedPaciente.setNome("Lívia ALTERADO");
        Paciente updatedPaciente = pacienteRepository.save(savedPaciente);
        assertEquals("Lívia ALTERADO", updatedPaciente.getNome());
    }

    @Test
    @Order(5)
    void delete () {
        Paciente savedPaciente = pacienteRepository.save(PacienteBuilder.build().now());
        assertNotNull(savedPaciente);

        pacienteRepository.delete(savedPaciente);
        assertFalse(pacienteRepository.existsById(savedPaciente.getId()));
    }
}
