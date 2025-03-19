import React from "react";
import "./About.css";

const About: React.FC = () => {
  return (
    <div className='about-container'>
      <h1 className='about-title'>关于我们</h1>
      <p className='about-description'>我们是一支充满激情的团队，致力于创造优秀的产品</p>
      <div className='team-grid'>
        <div className='member-card'>
          <div className='member-info'>
            <h3>我们的使命</h3>
            <p>为用户提供最好的产品体验</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
