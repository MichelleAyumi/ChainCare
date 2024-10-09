package com.chaincare.chaincare.model;

import lombok.Getter;

@Getter
public enum Sexo {
    M("MASCULINO"),
    F("FEMININO");

    private final String value;

    Sexo(String value) {
        this.value = value;
    }

}
