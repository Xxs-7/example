import React from "react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className='home-container'>
      <h1 className='home-title'>首页</h1>
      <div className='home-content'>
        <p>欢迎来到首页</p>
      </div>
    </div>
  );
};

export default Home;
