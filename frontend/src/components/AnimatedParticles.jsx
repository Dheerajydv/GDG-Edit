import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
`;

const Particle = styled.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
`;

const AnimatedParticles = ({ color = '#4285F4', count = 50, speed = 'medium' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];
    const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'fast' ? 2 : 1;

    // Clear existing particles
    container.innerHTML = '';

    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 2 and 8 pixels
      const size = Math.random() * 6 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random starting position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random opacity
      particle.style.opacity = Math.random() * 0.5 + 0.2;
      
      // Color with some variation
      const colors = [
        '#4285F4', // Google Blue
        '#EA4335', // Google Red
        '#FBBC05', // Google Yellow
        '#34A853', // Google Green
      ];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Random blur
      particle.style.filter = `blur(${Math.random() * 2}px)`;
      
      particle.style.position = 'absolute';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      
      container.appendChild(particle);
      
      // Store particle data
      particles.push({
        element: particle,
        x: parseFloat(particle.style.left),
        y: parseFloat(particle.style.top),
        vx: (Math.random() - 0.5) * 0.5 * speedMultiplier,
        vy: (Math.random() - 0.5) * 0.5 * speedMultiplier,
        size: size,
      });
    }

    // Animation function
    let animationFrameId;
    const animate = () => {
      particles.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > 100) {
          p.vx *= -1;
          p.x = p.x < 0 ? 0 : 100;
        }
        if (p.y < 0 || p.y > 100) {
          p.vy *= -1;
          p.y = p.y < 0 ? 0 : 100;
        }
        
        // Apply position
        p.element.style.left = `${p.x}%`;
        p.element.style.top = `${p.y}%`;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [color, count, speed]);

  return <ParticlesContainer ref={containerRef} />;
};

export default AnimatedParticles;
