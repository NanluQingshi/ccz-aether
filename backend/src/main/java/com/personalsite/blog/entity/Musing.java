package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("musing")
public class Musing extends BaseEntity {
    private String content;
    // idea | todo
    private String type;
    // 0=open, 1=done (only for todo type)
    private Integer done;
}
