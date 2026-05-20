package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName(value = "practice", autoResultMap = true)
public class Practice {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String category;
    private String categoryIcon;
    private String name;
    private String description;
    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<PracticeLink> links;
    // todo | in_progress | mastered
    private String status;
    private Integer sortOrder;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
