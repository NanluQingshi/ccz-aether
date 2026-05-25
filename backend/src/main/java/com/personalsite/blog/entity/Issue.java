package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("issue")
public class Issue extends BaseEntity {
    private String title;
    private String description;
    // 0=todo, 1=in_progress, 2=done
    private Integer status;
    // 0=low, 1=medium, 2=high
    private Integer priority;
}
