import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
`;

const Circle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  filter: blur(50px);
`;

const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${({ theme }) => `radial-gradient(${theme.colors.divider} 1px, transparent 1px)`};
  background-size: 30px 30px;
  opacity: 0.3;
`;

const AuthBackground = () => {
  const containerRef = useRef(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isAnimating.current) return;
      
      const { clientX, clientY } = e;
      const container = containerRef.current;
      
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const relativeX = (clientX - containerRect.left) / containerRect.width;
      const relativeY = (clientY - containerRect.top) / containerRect.height;
      
      // Slightly move circles based on mouse position
      const circles = container.querySelectorAll('.bg-circle');
      circles.forEach((circle, index) => {
        const factor = index % 2 === 0 ? 1 : -1;
        const strength = (index + 1) * 5;
        
        circle.style.transform = `translate(${relativeX * strength * factor}px, ${relativeY * strength * factor}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const generateCircles = () => {
    const colors = [
      '#4285F4', // Google Blue
      '#EA4335', // Google Red
      '#FBBC05', // Google Yellow
      '#34A853', // Google Green
    ];
    
    return colors.map((color, index) => (
      <Circle
        key={index}
        className="bg-circle"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          width: 150 + Math.random() * 300,
          height: 150 + Math.random() * 300,
          backgroundColor: color,
        }}
        animate={{
          x: [
            Math.random() * window.innerWidth,
            Math.random() * window.innerWidth,
            Math.random() * window.innerWidth
          ],
          y: [
            Math.random() * window.innerHeight,
            Math.random() * window.innerHeight,
            Math.random() * window.innerHeight
          ]
        }}
        transition={{
          duration: 60 + Math.random() * 40,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
    ));
  };

  return (
    <BackgroundContainer ref={containerRef}>
      {generateCircles()}
      <Grid />
    </BackgroundContainer>
  );
};

export default AuthBackground;