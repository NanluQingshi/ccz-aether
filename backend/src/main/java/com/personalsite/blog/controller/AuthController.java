package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.LoginRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.dto.response.LoginResponse;
import com.personalsite.blog.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                            HttpServletResponse response) {
        LoginResponse loginResponse = authService.login(request);
        ResponseCookie cookie = ResponseCookie.from("jwt", loginResponse.getToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/")
                .maxAge(jwtExpirationMs / 1000)
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        loginResponse.setToken(null);
        return ApiResponse.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();
        response.setHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ApiResponse.ok(null);
    }

    @GetMapping("/me")
    public ApiResponse<LoginResponse> me() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.ok(new LoginResponse(null, username));
    }
}
