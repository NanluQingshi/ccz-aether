package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.personalsite.blog.enums.IssuePriority;
import com.personalsite.blog.enums.IssueStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("issue")
public class Issue {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    private IssueStatus status;
    private IssuePriority priority;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
