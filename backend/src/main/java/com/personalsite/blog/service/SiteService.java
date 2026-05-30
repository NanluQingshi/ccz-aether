package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.SiteRequest;
import com.personalsite.blog.entity.Site;

import java.util.List;

public interface SiteService {

    List<Site> listAll();

    Site create(SiteRequest req);

    Site update(Long id, SiteRequest req);

    void delete(Long id);
}
