package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.PracticeRequest;
import com.personalsite.blog.entity.Practice;

import java.util.List;

public interface PracticeService {
    List<Practice> listAll();
    Practice create(PracticeRequest req);
    Practice update(Long id, PracticeRequest req);
    void delete(Long id);
}
