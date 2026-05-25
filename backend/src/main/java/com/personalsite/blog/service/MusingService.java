package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.MusingRequest;
import com.personalsite.blog.entity.Musing;

public interface MusingService extends CrudService<Musing, MusingRequest> {
    Musing toggleDone(Long id);
}
