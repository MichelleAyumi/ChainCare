package com.chaincare.chaincare.builder;

import com.chaincare.chaincare.model.Remedios;

public class RemediosBuilder {
    Remedios remedio;

    public static RemediosBuilder build() {
        RemediosBuilder builder = new RemediosBuilder();
        builder.remedio = new Remedios();
        builder.remedio.setDosagem("30mg");
        builder.remedio.setFormaFarmaceutica("Comprimido");

        return builder;
    }

    public Remedios now () {
        return remedio;
    }
}
