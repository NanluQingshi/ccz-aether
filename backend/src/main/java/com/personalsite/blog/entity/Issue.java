package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("issue")
public class Issue {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String description;
    // 0=todo, 1=in_progress, 2=done
    private Integer status;
    // 0=low, 1=medium, 2=high
    private Integer priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
