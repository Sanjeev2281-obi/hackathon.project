import React from 'react';
import Carousel from './components/Carousel';
import './styles/carousel.css';

const App = () => {
  return (
    <div className="app-container">
      <h1 className="hero-title">Welcome to Our Carousel</h1>
      <Carousel />
    </div>
  );
};

export default App;