package com.personalsite.blog.service;

import com.personalsite.blog.dto.request.IssueRequest;
import com.personalsite.blog.entity.Issue;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.IssueMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueMapper issueMapper;

    public List<Issue> listAll() {
        return issueMapper.selectList(null);
    }

    public Issue create(IssueRequest req) {
        Issue issue = new Issue();
        issue.setTitle(req.getTitle());
        issue.setDescription(req.getDescription());
        issue.setPriority(req.getPriority());
        issue.setStatus(0);
        issueMapper.insert(issue);
        return issue;
    }

    public Issue update(Long id, IssueRequest req) {
        Issue issue = issueMapper.selectById(id);
        if (issue == null) throw new BizException(ErrorCode.NOT_FOUND);
        issue.setTitle(req.getTitle());
        issue.setDescription(req.getDescription());
        issue.setPriority(req.getPriority());
        issueMapper.updateById(issue);
        return issue;
    }

    public Issue updateStatus(Long id, Integer status) {
        Issue issue = issueMapper.selectById(id);
        if (issue == null) throw new BizException(ErrorCode.NOT_FOUND);
        issue.setStatus(status);
        issueMapper.updateById(issue);
        return issue;
    }

    public void delete(Long id) {
        issueMapper.deleteById(id);
    }
}
