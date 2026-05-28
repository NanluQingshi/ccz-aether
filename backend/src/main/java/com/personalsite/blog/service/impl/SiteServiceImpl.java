package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.SiteRequest;
import com.personalsite.blog.entity.Site;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.SiteMapper;
import com.personalsite.blog.service.SiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteServiceImpl implements SiteService {

    private final SiteMapper siteMapper;

    @Override
    public List<Site> listAll() {
        return siteMapper.selectList(
                new LambdaQueryWrapper<Site>()
                        .orderByAsc(Site::getCategory)
                        .orderByAsc(Site::getSortOrder));
    }

    @Override
    public Site create(SiteRequest req) {
        Site site = new Site();
        applyRequest(site, req);
        siteMapper.insert(site);
        return site;
    }

    @Override
    public Site update(Long id, SiteRequest req) {
        Site site = siteMapper.selectById(id);
        if (site == null) throw new BizException(ErrorCode.NOT_FOUND);
        applyRequest(site, req);
        siteMapper.updateById(site);
        return site;
    }

    @Override
    public void delete(Long id) {
        if (siteMapper.selectById(id) == null) throw new BizException(ErrorCode.NOT_FOUND);
        siteMapper.deleteById(id);
    }

    private void applyRequest(Site site, SiteRequest req) {
        site.setName(req.getName());
        site.setUrl(req.getUrl());
        site.setCategory(req.getCategory());
        site.setSortOrder(req.getSortOrder() != null ? req.getSortOrder() : 0);
    }
}
