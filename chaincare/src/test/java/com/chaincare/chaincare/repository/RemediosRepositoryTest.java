package com.chaincare.chaincare.repository;

import com.chaincare.chaincare.builder.RemediosBuilder;
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
public class RemediosRepositoryTest {
    @Autowired
    RemediosRepository remediosRepository;

    @Test
    @Order(1)
    void save () {
        Remedios savedRemedios = RemediosBuilder.build().now();
        savedRemedios.setNome("Frontal");
        remediosRepository.save(savedRemedios);
        assertNotNull(savedRemedios);
    }

    @Test
    @Order(2)
    void findById () {
        Remedios savedRemedios = RemediosBuilder.build().now();
        savedRemedios.setNome("Rivotril");
        remediosRepository.save(savedRemedios);
        assertNotNull(savedRemedios);

        Optional<Remedios> loadedRemedios = remediosRepository.findById(savedRemedios.getId());
        assertNotNull(loadedRemedios);
    }

    @Test
    @Order(3)
    void loadAll () {
        List<Remedios> laudos = remediosRepository.findAll();
        assertNotNull(laudos);
    }

    @Test
    @Order(4)
    void update () {
        Remedios firstLaudo = remediosRepository.findAll().getFirst();

        firstLaudo.setDosagem("50mg");
        Remedios updatedRemedios = remediosRepository.save(firstLaudo);
        assertEquals("50mg", updatedRemedios.getDosagem());
    }

    @Test
    @Order(5)
    void delete () {
        Remedios firstLaudo = remediosRepository.findAll().getFirst();
        remediosRepository.delete(firstLaudo);
        assertFalse(remediosRepository.existsById(firstLaudo.getId()));
    }
}
