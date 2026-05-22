package com.personalsite.blog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// CORS 由 SecurityConfig.corsConfigurationSource() 统一管理
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
}
