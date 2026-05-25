package com.personalsite.blog.service.impl;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.personalsite.blog.exception.BizException;
import com.personalsite.blog.exception.ErrorCode;
import com.personalsite.blog.service.CrudService;

public abstract class BaseCrudService<T, Req> implements CrudService<T, Req> {

    protected abstract BaseMapper<T> getMapper();

    protected abstract T newEntity();

    protected abstract void applyRequest(T entity, Req req);

    /** 创建时设置默认值，在 applyRequest 之后、insert 之前调用 */
    protected void initEntity(T entity, Req req) {}

    @Override
    public T create(Req req) {
        T entity = newEntity();
        applyRequest(entity, req);
        initEntity(entity, req);
        getMapper().insert(entity);
        return entity;
    }

    @Override
    public T update(Long id, Req req) {
        T entity = getMapper().selectById(id);
        if (entity == null) throw new BizException(ErrorCode.NOT_FOUND);
        applyRequest(entity, req);
        getMapper().updateById(entity);
        return entity;
    }

    @Override
    public void delete(Long id) {
        if (getMapper().selectById(id) == null) throw new BizException(ErrorCode.NOT_FOUND);
        getMapper().deleteById(id);
    }
}
