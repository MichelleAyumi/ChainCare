package com.chaincare.chaincare.builder;

import com.chaincare.chaincare.model.LaudosRemedios;
import com.chaincare.chaincare.repository.LaudosRepository;
import com.chaincare.chaincare.repository.RemediosRepository;

public class LaudosRemediosBuilder {
    LaudosRemedios laudosRemedios;

    public static LaudosRemediosBuilder build() {
        LaudosRemediosBuilder builder = new LaudosRemediosBuilder();
        builder.laudosRemedios = new LaudosRemedios();
        return builder;
    }

    public LaudosRemediosBuilder addLaudo(LaudosRepository laudosRepository) {
        laudosRemedios.setLaudo(laudosRepository.findAll().getFirst());
        return this;
    }

    public LaudosRemediosBuilder addRemedio(RemediosRepository remediosRepository) {
        laudosRemedios.setRemedio(remediosRepository.findAll().getFirst());
        return this;
    }

    public LaudosRemedios now () {
        return laudosRemedios;
    }
}
