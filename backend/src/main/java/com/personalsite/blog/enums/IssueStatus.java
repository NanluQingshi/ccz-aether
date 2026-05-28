package com.personalsite.blog.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum IssueStatus {

    TODO(0),
    IN_PROGRESS(1),
    DONE(2);

    @EnumValue
    private final Integer code;

    @JsonValue
    public Integer getCode() {
        return code;
    }

    @JsonCreator
    public static IssueStatus fromCode(Integer code) {
        if (code == null) return null;
        for (IssueStatus s : values()) {
            if (s.code.equals(code)) return s;
        }
        throw new IllegalArgumentException("Unknown IssueStatus: " + code);
    }
}
