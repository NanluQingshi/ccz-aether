package com.personalsite.blog.controller;

import com.personalsite.blog.dto.request.PracticeRequest;
import com.personalsite.blog.entity.Practice;
import com.personalsite.blog.service.CrudService;
import com.personalsite.blog.service.PracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/practice")
@RequiredArgsConstructor
public class PracticeController extends BaseCrudController<Practice, PracticeRequest> {

    private final PracticeService practiceService;

    @Override
    protected CrudService<Practice, PracticeRequest> getService() {
        return practiceService;
    }
}
