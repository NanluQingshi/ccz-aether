package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.personalsite.blog.dto.request.MusingRequest;
import com.personalsite.blog.entity.Musing;
import com.personalsite.blog.enums.MusingType;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.mapper.MusingMapper;
import com.personalsite.blog.service.MusingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MusingServiceImpl implements MusingService {

    private final MusingMapper musingMapper;

    private static final int DONE_OPEN = 0;
    private static final int DONE_DONE = 1;

    @Override
    public List<Musing> listAll() {
        return musingMapper.selectList(
                new LambdaQueryWrapper<Musing>().orderByDesc(Musing::getCreatedAt));
    }

    @Override
    public Musing create(MusingRequest req) {
        Musing musing = new Musing();
        musing.setContent(req.getContent());
        musing.setType(req.getType() != null ? req.getType() : MusingType.IDEA);
        musing.setDone(DONE_OPEN);
        musingMapper.insert(musing);
        return musing;
    }

    @Override
    public Musing update(Long id, MusingRequest req) {
        Musing musing = musingMapper.selectById(id);
        if (musing == null) throw new BizException(ErrorCode.NOT_FOUND);
        musing.setContent(req.getContent());
        if (req.getType() != null) musing.setType(req.getType());
        musingMapper.updateById(musing);
        return musing;
    }

    @Override
    public Musing toggleDone(Long id) {
        Musing musing = musingMapper.selectById(id);
        if (musing == null) throw new BizException(ErrorCode.NOT_FOUND);
        musing.setDone(DONE_DONE == musing.getDone() ? DONE_OPEN : DONE_DONE);
        musingMapper.updateById(musing);
        return musing;
    }

    @Override
    public void delete(Long id) {
        if (musingMapper.selectById(id) == null) throw new BizException(ErrorCode.NOT_FOUND);
        musingMapper.deleteById(id);
    }
}
