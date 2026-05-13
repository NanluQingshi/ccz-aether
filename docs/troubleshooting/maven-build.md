# Maven / 构建工具问题

## 1. 找不到 spring-boot 插件

### 问题描述

执行 `mvn spring-boot:run` 时报错：

```
No plugin found for prefix 'spring-boot' in the current project and in the plugin groups
[org.apache.maven.plugins, org.codehaus.mojo]
```

### 原因

在错误的目录下执行了命令，当前目录下没有 `pom.xml`，Maven 无法识别项目。

### 解决方案

必须在 `backend/` 目录下执行：

```bash
cd backend
mvn spring-boot:run
```

或使用 `-f` 参数指定 `pom.xml` 路径，在任意目录执行：

```bash
mvn -f /path/to/project/backend/pom.xml spring-boot:run
```

---

## 2. JDK 版本冲突导致编译失败

### 问题描述

执行 `mvn spring-boot:run` 时报错：

```
Fatal error compiling: java.lang.ExceptionInInitializerError:
com.sun.tools.javac.code.TypeTag :: UNKNOWN
```

### 原因

`mvn -version` 显示 Maven 使用的是 Homebrew 安装的 JDK 25，而项目 `pom.xml` 配置的是 Java 17，两者不兼容导致编译器初始化失败。

```
Java version: 25.0.2, vendor: Homebrew
```

### 解决方案

**永久生效（推荐）**：在 `~/.zshrc` 中显式导出 JDK 17 路径：

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
```

执行后重新加载：

```bash
source ~/.zshrc
```

验证：

```bash
mvn -version
# 应显示 Java version: 17.x.x
```

### 注意

`~/.zshrc` 中已有 `JAVA_HOME=...` 但缺少 `export` 关键字时，该变量不会被子进程（包括 Maven）继承，必须加上 `export`。
