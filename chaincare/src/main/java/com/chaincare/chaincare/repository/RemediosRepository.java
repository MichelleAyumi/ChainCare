package com.chaincare.chaincare.repository;

import com.chaincare.chaincare.model.Remedios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RemediosRepository extends JpaRepository<Remedios, Integer> {
}
