import React from 'react';

const AboutPage: React.FC = () => (
  <div className="container page-content">
    <h1 className="page-title">关于我</h1>
    <div className="prose">
      <p>
        你好！我是一名全栈开发者，热衷于探索各类技术，尤其是 Java 后端和 React 前端。
      </p>
      <h2>技术背景</h2>
      <p>
        主要技术栈：Spring Boot、MyBatis-Plus、React、TypeScript、MySQL、Docker。
        喜欢写整洁的代码，关注系统设计与架构。
      </p>
      <h2>联系方式</h2>
      <ul>
        <li>GitHub: <a href="https://github.com/NanluQingshi" target="_blank" rel="noreferrer">github.com/NanluQingshi</a></li>
        <li>Email: nlqs@mail.ustc.edu.cn</li>
      </ul>
    </div>
  </div>
);

export default AboutPage;
