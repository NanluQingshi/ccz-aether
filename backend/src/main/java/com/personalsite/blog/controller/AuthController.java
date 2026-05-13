package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.LoginRequest;
import com.personalsite.blog.dto.response.ApiResponse;
import com.personalsite.blog.dto.response.LoginResponse;
import com.personalsite.blog.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }
}
