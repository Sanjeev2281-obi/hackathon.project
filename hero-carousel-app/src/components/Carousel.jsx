import React, { useEffect, useRef } from 'react';
import './styles/carousel.css';

const images = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg'
];

const Carousel = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    let scrollAmount = 0;
    const scrollSpeed = 1;

    const scrollImages = () => {
      scrollAmount += scrollSpeed;
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
      requestAnimationFrame(scrollImages);
    };

    scrollImages();
  }, []);

  return (
    <div className="carousel-container">
      <div
        ref={scrollRef}
        className="carousel-scroll"
      >
        {[...images, ...images].map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`slide-${idx}`}
            className="carousel-image"
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;