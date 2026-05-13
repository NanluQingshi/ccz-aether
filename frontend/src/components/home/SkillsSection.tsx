import React from 'react';

const skills = [
  { name: 'Java', level: 90 },
  { name: 'Spring Boot', level: 85 },
  { name: 'React', level: 80 },
  { name: 'TypeScript', level: 75 },
  { name: 'MySQL', level: 80 },
  { name: 'Docker', level: 70 },
];

export const SkillsSection: React.FC = () => (
  <section className="section">
    <h2 className="section-title">技术栈</h2>
    <div className="skills-grid">
      {skills.map((skill) => (
        <div key={skill.name} className="skill-item">
          <div className="skill-header">
            <span className="skill-name">{skill.name}</span>
            <span className="skill-level">{skill.level}%</span>
          </div>
          <div className="skill-bar">
            <div className="skill-fill" style={{ width: `${skill.level}%` }} />
          </div>
        </div>
      ))}
    </div>
  </section>
);
