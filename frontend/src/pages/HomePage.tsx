import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { RecentPosts } from '../components/home/RecentPosts';

const HomePage: React.FC = () => (
  <div>
    <HeroSection />
    <div className="container">
      <SkillsSection />
      <RecentPosts />
    </div>
  </div>
);

export default HomePage;
