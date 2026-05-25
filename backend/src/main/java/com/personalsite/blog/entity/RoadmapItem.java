package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("roadmap_item")
public class RoadmapItem extends BaseEntity {
    private String groupLabel;
    private String groupIcon;
    private String name;
    private String description;
    /** done | planned */
    private String status;
    /** high | medium | low，planned 时必填，done 时可为 null */
    private String priority;
    private Integer sortOrder;
}
