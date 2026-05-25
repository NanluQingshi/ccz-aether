package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.IssueRequest;
import com.personalsite.blog.entity.Issue;

public interface IssueService extends CrudService<Issue, IssueRequest> {
    Issue updateStatus(Long id, Integer status);
}
