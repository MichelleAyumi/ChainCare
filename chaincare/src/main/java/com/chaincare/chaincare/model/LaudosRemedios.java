package com.chaincare.chaincare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "laudos_remedios")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LaudosRemedios {
    @EmbeddedId
    private LaudosRemediosId id;

    @ManyToOne
    @MapsId("laudoID")
    @JoinColumn(name = "laudo_id", foreignKey = @ForeignKey(name = "FK_LaudoID"))
    private Laudos laudo;

    @ManyToOne
    @MapsId("remedioID")
    @JoinColumn(name = "remedio_id", foreignKey = @ForeignKey(name = "FK_RemedioID"))
    private Remedios remedio;
}