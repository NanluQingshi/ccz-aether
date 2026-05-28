package com.personalsite.blog.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RoadmapPriority {

    HIGH("high"),
    MEDIUM("medium"),
    LOW("low");

    @EnumValue
    private final String code;

    @JsonValue
    public String getCode() {
        return code;
    }

    @JsonCreator
    public static RoadmapPriority fromCode(String code) {
        for (RoadmapPriority p : values()) {
            if (p.code.equals(code)) return p;
        }
        throw new IllegalArgumentException("Unknown RoadmapPriority: " + code);
    }
}
