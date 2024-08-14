package com.chaincare.chaincare.model;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class LaudosRemediosId implements Serializable {
    private Integer laudoID;
    private Integer remedioID;
}