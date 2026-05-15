package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.LoginRequest;
import com.personalsite.blog.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);
}
