import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { SkillsSection } from '../components/home/SkillsSection';
import { RecentPosts } from '../components/home/RecentPosts';
import { SiteNavSection } from '../components/home/SiteNavSection';

const HomePage: React.FC = () => (
  <div>
    <HeroSection />
    <div className="container">
      <SiteNavSection />
      <SkillsSection />
      <RecentPosts />
    </div>
  </div>
);

export default HomePage;
