package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.IssueRequest;
import com.personalsite.blog.entity.Issue;

import java.util.List;

public interface IssueService {

    List<Issue> listAll();

    Issue create(IssueRequest req);

    Issue update(Long id, IssueRequest req);

    Issue updateStatus(Long id, Integer status);

    void delete(Long id);
}
