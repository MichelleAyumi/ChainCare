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
        Paciente savedPaciente = PacienteBuilder.build().now();
        savedPaciente.setCns("1111111");
        savedPaciente.setCpf("11111111111");
        savedPaciente.setRg("111111111");
        pacienteRepository.save(savedPaciente);
        assertNotNull(savedPaciente);
    }

    @Test
    @Order(2)
    void findById () {
        Paciente savedPaciente = PacienteBuilder.build().now();
        savedPaciente.setCns("2222222");
        savedPaciente.setCpf("22222222222");
        savedPaciente.setRg("222222222");
        pacienteRepository.save(savedPaciente);
        assertNotNull(savedPaciente);

        Optional<Paciente> loadedPaciente = pacienteRepository.findById(savedPaciente.getId());
        assertNotNull(loadedPaciente);
    }

    @Test
    @Order(3)
    void loadAll () {
        List<Paciente> pacientes = pacienteRepository.findAll();
        assertNotNull(pacientes);
    }

    @Test
    @Order(4)
    void update () {
        Paciente firstPaciente = pacienteRepository.findAll().getFirst();

        firstPaciente.setNome("Lívia ALTERADO");
        Paciente updatedPaciente = pacienteRepository.save(firstPaciente);
        assertEquals("Lívia ALTERADO", updatedPaciente.getNome());
    }

    @Test
    @Order(5)
    void delete () {
        Paciente firstPaciente = pacienteRepository.findAll().getFirst();
        pacienteRepository.delete(firstPaciente);
        assertFalse(pacienteRepository.existsById(firstPaciente.getId()));
    }
}
