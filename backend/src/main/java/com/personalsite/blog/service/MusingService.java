package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.MusingRequest;
import com.personalsite.blog.entity.Musing;

import java.util.List;

public interface MusingService {

    List<Musing> listAll();

    Musing create(MusingRequest req);

    Musing update(Long id, MusingRequest req);

    Musing toggleDone(Long id);

    void delete(Long id);
}
