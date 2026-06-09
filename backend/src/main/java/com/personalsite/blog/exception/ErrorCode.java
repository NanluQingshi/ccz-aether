package com.personalsite.blog.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    NOT_FOUND(404, "资源不存在"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "无权限"),
    BAD_REQUEST(400, "请求参数错误"),
    USERNAME_OR_PASSWORD_ERROR(401, "用户名或密码错误"),
    CURRENT_PASSWORD_ERROR(400, "当前密码错误"),
    POST_NOT_FOUND(404, "文章不存在"),
    TAG_NOT_FOUND(404, "标签不存在"),
    CATEGORY_NOT_FOUND(404, "分类不存在"),
    SLUG_ALREADY_EXISTS(400, "Slug 已存在"),
    INTERNAL_ERROR(500, "服务器内部错误");

    private final int code;
    private final String message;
}
