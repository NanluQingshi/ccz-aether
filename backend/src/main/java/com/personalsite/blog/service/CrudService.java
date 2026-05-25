package com.personalsite.blog.service;

import java.util.List;

public interface CrudService<T, Req> {
    List<T> listAll();
    T create(Req req);
    T update(Long id, Req req);
    void delete(Long id);
}
