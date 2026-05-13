# Spring Boot / MyBatis-Plus 兼容性问题

## 1. BeanDefinitionStoreException：Mapper 泛型类型推断失败

### 问题描述

Spring Boot 启动时报错：

```
BeanDefinitionStoreException: Invalid bean definition with name 'categoryMapper'
defined in file [.../CategoryMapper.class]:
Invalid value type for attribute 'factoryBeanObjectType': java.lang.String
```

### 原因

MyBatis-Plus 的 `BaseMapper<T>` 泛型在 Spring Boot 3.3 的 `AnnotationDependsOnDatabaseInitializationDetector` 做 Bean 类型推断时触发了已知兼容性 Bug。具体表现为：继承了 `BaseMapper<T>` 的 Mapper 接口启动时无法被正确解析。

### 解决方案

将 `pom.xml` 中的 starter 从通用版替换为 Spring Boot 3 专用版：

```xml
<!-- 替换前 -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.9</version>
</dependency>

<!-- 替换后 -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.9</version>
</dependency>
```

`mybatis-plus-spring-boot3-starter` 是 MyBatis-Plus 官方为 Spring Boot 3.x 提供的专用 starter，内部处理了泛型推断问题。

---

## 2. PaginationInnerInterceptor 类找不到

### 问题描述

升级 MyBatis-Plus 到 3.5.9 后编译报错：

```
cannot find symbol
symbol:   class PaginationInnerInterceptor
location: package com.baomidou.mybatisplus.extension.plugins.inner
```

### 原因

MyBatis-Plus 3.5.9 将分页插件从核心包中拆分出去，移入了独立模块 `mybatis-plus-jsqlparser`，原来的 `mybatis-plus-extension` 中不再包含 `PaginationInnerInterceptor`。

### 解决方案

在 `pom.xml` 中额外引入分页插件依赖：

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-jsqlparser</artifactId>
    <version>3.5.9</version>
</dependency>
```

引入后 `PaginationInnerInterceptor` 的包路径不变，`MybatisPlusConfig` 无需修改：

```java
interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
```

---

## 3. @Select 注解返回自定义 VO 导致 Bean 解析失败

### 问题描述

Mapper 接口中使用 `@Select` 注解定义返回自定义 VO 类型的方法时，Spring 启动报 `BeanDefinitionStoreException`（同问题1），即使已换用 `spring-boot3-starter` 仍偶发。

### 原因

Spring 在解析 Mapper Bean 类型时，对带有非实体返回类型的 `@Select` 注解方法处理存在边界问题。

### 解决方案

将 `@Select` 注解中的 SQL 迁移到 XML Mapper 文件，接口只保留方法签名：

**修改前（Mapper 接口）：**
```java
@Select("SELECT id, name, slug, COUNT(...) AS post_count FROM ...")
List<CategoryVO> selectWithPostCount();
```

**修改后（Mapper 接口）：**
```java
// 移除 @Select，仅保留签名
List<CategoryVO> selectWithPostCount();
```

**新增 XML 文件** `resources/mapper/CategoryMapper.xml`：
```xml
<select id="selectWithPostCount" resultType="com.personalsite.blog.dto.response.CategoryVO">
    SELECT c.id, c.name, c.slug, c.description,
           COUNT(p.id) AS post_count
    FROM category c
    LEFT JOIN post p ON p.category_id = c.id AND p.status = 1 AND p.deleted = 0
    GROUP BY c.id
    ORDER BY c.name
</select>
```

同时确保 `application.yml` 配置了 XML 文件扫描路径：

```yaml
mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
```
