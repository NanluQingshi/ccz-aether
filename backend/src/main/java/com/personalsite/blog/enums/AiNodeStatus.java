package com.personalsite.blog.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AiNodeStatus {

    NOT_STARTED("not_started"),
    IN_PROGRESS("in_progress"),
    COMPLETED("completed");

    @EnumValue
    private final String code;

    @JsonValue
    public String getCode() {
        return code;
    }

    @JsonCreator
    public static AiNodeStatus fromCode(String code) {
        for (AiNodeStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Unknown AiNodeStatus: " + code);
    }
}
