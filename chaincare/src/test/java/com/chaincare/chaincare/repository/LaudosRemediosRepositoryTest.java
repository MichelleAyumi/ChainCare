package com.chaincare.chaincare.repository;

import com.chaincare.chaincare.builder.LaudosRemediosBuilder;
import com.chaincare.chaincare.model.Laudos;
import com.chaincare.chaincare.model.LaudosRemedios;
import com.chaincare.chaincare.model.LaudosRemediosId;
import com.chaincare.chaincare.model.Remedios;
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
public class LaudosRemediosRepositoryTest {
    @Autowired
    LaudosRemediosRepository laudosRemediosRepository;

    @Autowired
    LaudosRepository laudosRepository;

    @Autowired
    RemediosRepository remediosRepository;

    @Test
    @Order(1)
    void save () {
        LaudosRemediosId laudoRemedioId = new LaudosRemediosId();
        laudoRemedioId.setRemedioID(remediosRepository.findAll().getFirst().getId());
        laudoRemedioId.setLaudoID(laudosRepository.findAll().getFirst().getId());

        LaudosRemedios savedLaudoRemedio = LaudosRemediosBuilder.build().addLaudo(laudosRepository).addRemedio(remediosRepository).now();
        savedLaudoRemedio.setId(laudoRemedioId);

        laudosRemediosRepository.save(savedLaudoRemedio);
        assertNotNull(savedLaudoRemedio);
    }

    @Test
    @Order(2)
    void findById () {
        LaudosRemediosId laudoRemedioId = new LaudosRemediosId();
        laudoRemedioId.setRemedioID(remediosRepository.findAll().getFirst().getId());
        laudoRemedioId.setLaudoID(laudosRepository.findAll().getFirst().getId());

        LaudosRemedios savedLaudoRemedio = LaudosRemediosBuilder.build().addLaudo(laudosRepository).addRemedio(remediosRepository).now();
        savedLaudoRemedio.setId(laudoRemedioId);

        laudosRemediosRepository.save(savedLaudoRemedio);
        assertNotNull(savedLaudoRemedio);

        Optional<LaudosRemedios> loadedLaudosRemedios = laudosRemediosRepository.findById(savedLaudoRemedio.getId());
        assertNotNull(loadedLaudosRemedios);
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
        LaudosRemedios firstLaudo = laudosRemediosRepository.findAll().getFirst();
        Remedios remedio = remediosRepository.findAll().getLast();

        firstLaudo.setRemedio(remedio);
        LaudosRemedios updatedLaudosRemedios = laudosRemediosRepository.save(firstLaudo);
        assertEquals(remedio.getId(), updatedLaudosRemedios.getRemedio().getId());
    }

    @Test
    @Order(5)
    void delete () {
        LaudosRemedios firstLaudo = laudosRemediosRepository.findAll().getFirst();
        laudosRemediosRepository.delete(firstLaudo);
        assertFalse(laudosRemediosRepository.existsById(firstLaudo.getId()));
    }
}
