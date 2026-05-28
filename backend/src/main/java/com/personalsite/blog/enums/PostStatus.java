package com.personalsite.blog.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PostStatus {

    DRAFT(0),
    PUBLISHED(1);

    @EnumValue
    private final Integer code;

    @JsonValue
    public Integer getCode() {
        return code;
    }

    @JsonCreator
    public static PostStatus fromCode(Integer code) {
        if (code == null) return null;
        for (PostStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Unknown PostStatus: " + code);
    }
}
