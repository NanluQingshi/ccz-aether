package com.personalsite.blog.entity;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.personalsite.blog.enums.MusingType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("musing")
public class Musing {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String content;
    private MusingType type;
    /** 0=open, 1=done（仅 todo 类型使用） */
    private Integer done;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
