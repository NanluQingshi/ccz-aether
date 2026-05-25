package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName(value = "practice", autoResultMap = true)
public class Practice extends BaseEntity {
    private String category;
    private String categoryIcon;
    private String name;
    private String description;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<PracticeLink> links;
    // todo | in_progress | mastered
    private String status;
    private Integer sortOrder;
}
