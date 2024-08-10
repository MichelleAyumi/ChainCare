package com.chaincare.chaincare.repository;

import com.chaincare.chaincare.model.Laudos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LaudosRepository extends JpaRepository<Laudos, Integer> {
}
