package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.personalsite.blog.enums.AiNodeStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName(value = "ai_node", autoResultMap = true)
public class AiNode {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String description;

    private String icon;

    private AiNodeStatus status;

    private Long parentId;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<AiNodeResource> resources;

    private Integer sortOrder;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
