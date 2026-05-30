package com.personalsite.blog.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum BookStatus {

    WANT("want"),
    READING("reading"),
    DONE("done");

    @EnumValue
    private final String code;

    @JsonValue
    public String getCode() {
        return code;
    }

    @JsonCreator
    public static BookStatus fromCode(String code) {
        for (BookStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Unknown BookStatus: " + code);
    }
}
