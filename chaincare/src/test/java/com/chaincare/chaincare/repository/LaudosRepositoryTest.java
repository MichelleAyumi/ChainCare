package com.chaincare.chaincare.repository;

import com.chaincare.chaincare.builder.LaudosBuilder;
import com.chaincare.chaincare.model.Laudos;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class LaudosRepositoryTest {
    @Autowired
    LaudosRepository laudosRepository;

    @Autowired
    PacienteRepository pacienteRepository;

    @Test
    @Order(1)
    void save () {
        Laudos savedLaudos = LaudosBuilder.build().addPaciente(pacienteRepository).now();
        laudosRepository.save(savedLaudos);
        assertNotNull(savedLaudos);
    }

    @Test
    @Order(2)
    void findById () {
        Laudos savedLaudos = LaudosBuilder.build().addPaciente(pacienteRepository).now();
        laudosRepository.save(savedLaudos);
        assertNotNull(savedLaudos);

        Optional<Laudos> loadedLaudos = laudosRepository.findById(savedLaudos.getId());
        assertNotNull(loadedLaudos);
    }

    @Test
    @Order(3)
    void loadAll () {
        List<Laudos> laudos = laudosRepository.findAll();
        assertNotNull(laudos);
    }

    @Test
    @Order(4)
    void update () {
        Laudos firstLaudo = laudosRepository.findAll().getFirst();
        LocalDateTime dataHoraAtual = LocalDateTime.now();

        firstLaudo.setDataHoraInicio(dataHoraAtual.plusDays(1));
        Laudos updatedLaudos = laudosRepository.save(firstLaudo);
        assertEquals(dataHoraAtual.plusDays(1), updatedLaudos.getDataHoraInicio());
    }

    @Test
    @Order(5)
    void delete () {
        Laudos firstLaudo = laudosRepository.findAll().getFirst();
        laudosRepository.delete(firstLaudo);
        assertFalse(laudosRepository.existsById(firstLaudo.getId()));
    }
}
