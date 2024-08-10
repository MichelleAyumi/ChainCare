package com.chaincare.chaincare.repository;

import com.chaincare.chaincare.model.LaudosRemedios;
import com.chaincare.chaincare.model.LaudosRemediosId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LaudosRemediosRepository extends JpaRepository<LaudosRemedios, LaudosRemediosId> {
}
