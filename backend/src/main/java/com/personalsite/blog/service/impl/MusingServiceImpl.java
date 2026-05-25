package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.dto.request.MusingRequest;
import com.personalsite.blog.entity.Musing;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.MusingMapper;
import com.personalsite.blog.service.MusingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MusingServiceImpl extends BaseCrudService<Musing, MusingRequest> implements MusingService {

    private final MusingMapper musingMapper;

    @Override
    public List<Musing> listAll() {
        return musingMapper.selectList(
                new LambdaQueryWrapper<Musing>().orderByDesc(Musing::getCreatedAt));
    }

    @Override
    protected BaseMapper<Musing> getMapper() {
        return musingMapper;
    }

    @Override
    protected Musing newEntity() {
        return new Musing();
    }

    @Override
    protected void applyRequest(Musing musing, MusingRequest req) {
        musing.setContent(req.getContent());
        if (req.getType() != null) musing.setType(req.getType());
    }

    @Override
    protected void initEntity(Musing musing, MusingRequest req) {
        if (musing.getType() == null) musing.setType("idea");
        musing.setDone(0);
    }

    @Override
    public Musing toggleDone(Long id) {
        Musing musing = musingMapper.selectById(id);
        if (musing == null) throw new BizException(ErrorCode.NOT_FOUND);
        musing.setDone(musing.getDone() == 1 ? 0 : 1);
        musingMapper.updateById(musing);
        return musing;
    }
}
