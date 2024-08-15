package com.chaincare.chaincare.controller;

import com.chaincare.chaincare.model.Paciente;
import com.chaincare.chaincare.repository.PacienteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/paciente")
public class PacienteRestController {
    private final PacienteRepository pacienteRepository;

    public PacienteRestController(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @GetMapping()
    public ResponseEntity<List<Paciente>> getPaciente() {
        try {
            return new ResponseEntity<>(pacienteRepository.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Paciente>> getPaciente(@PathVariable Integer id) {
        try {
            return new ResponseEntity<>(pacienteRepository.findById(id), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping()
    public ResponseEntity<?> savePaciente(@RequestBody Paciente paciente) {
        try {
            return new ResponseEntity<>(pacienteRepository.save(paciente), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePaciente(@RequestBody Paciente paciente) {
        try {
            return new ResponseEntity<>(pacienteRepository.save(paciente), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro: " + e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Paciente> deletePaciente(@PathVariable Integer id) {
        try {
            pacienteRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
