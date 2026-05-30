package com.personalsite.blog.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum IssuePriority {

    LOW(0),
    MEDIUM(1),
    HIGH(2);

    @EnumValue
    private final Integer code;

    @JsonValue
    public Integer getCode() {
        return code;
    }

    @JsonCreator
    public static IssuePriority fromCode(Integer code) {
        if (code == null) return null;
        for (IssuePriority p : values()) {
            if (p.code.equals(code)) return p;
        }
        throw new IllegalArgumentException("Unknown IssuePriority: " + code);
    }
}
