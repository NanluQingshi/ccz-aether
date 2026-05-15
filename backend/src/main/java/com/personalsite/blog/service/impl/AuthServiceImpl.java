package com.personalsite.blog.service.impl;

import com.personalsite.blog.dto.request.LoginRequest;
import com.personalsite.blog.dto.response.LoginResponse;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.security.JwtUtil;
import com.personalsite.blog.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            String token = jwtUtil.generateToken(auth.getName());
            return new LoginResponse(token, auth.getName());
        } catch (BadCredentialsException e) {
            throw new BizException(ErrorCode.USERNAME_OR_PASSWORD_ERROR);
        }
    }
}
