package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.personalsite.blog.enums.RoadmapPriority;
import com.personalsite.blog.enums.RoadmapStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("roadmap_item")
public class RoadmapItem {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String groupLabel;
    private String groupIcon;
    private String name;
    private String description;
    private RoadmapStatus status;
    /** planned 时必填，done 时可为 null */
    private RoadmapPriority priority;
    private Integer sortOrder;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
