# Node.js / 前端环境问题

## create-vite 版本不兼容

### 问题描述

执行 `npm create vite@latest` 时报错：

```
SyntaxError: The requested module 'node:util' does not provide an export named 'styleText'
```

### 原因

`create-vite@9.x` 要求 Node.js `>=20.19.0` 或 `>=22.12.0`，而本机 Node.js 版本为 `v18.20.8`，不满足要求。

### 解决方案

指定使用与 Node.js 18 兼容的旧版 create-vite：

```bash
npm create vite@5 frontend -- --template react-ts
```

### 说明

Vite 5 对 Node.js 18 支持完好，功能上无明显差异。待 Node.js 升级到 20+ 后可改用最新版。
