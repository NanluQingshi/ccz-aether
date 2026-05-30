package com.personalsite.blog.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RoadmapStatus {

    PLANNED("planned"),
    DONE("done");

    @EnumValue
    private final String code;

    @JsonValue
    public String getCode() {
        return code;
    }

    @JsonCreator
    public static RoadmapStatus fromCode(String code) {
        for (RoadmapStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Unknown RoadmapStatus: " + code);
    }
}
