package com.personalsite.blog.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum MusingType {

    IDEA("idea"),
    TODO("todo");

    @EnumValue
    private final String code;

    @JsonValue
    public String getCode() {
        return code;
    }

    @JsonCreator
    public static MusingType fromCode(String code) {
        for (MusingType t : values()) {
            if (t.code.equals(code)) return t;
        }
        throw new IllegalArgumentException("Unknown MusingType: " + code);
    }
}
