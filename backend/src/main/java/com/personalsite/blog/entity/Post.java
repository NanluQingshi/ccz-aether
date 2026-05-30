package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.personalsite.blog.enums.PostStatus;
import com.personalsite.blog.enums.PostType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("post")
public class Post {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String slug;
    private String summary;
    private String content;
    private String coverImage;
    private PostType type;
    private LocalDate eventDate;
    private Long categoryId;
    private PostStatus status;
    private Integer viewCount;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    @TableLogic
    private Integer deleted;
}
