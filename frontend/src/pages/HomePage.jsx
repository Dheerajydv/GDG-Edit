import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticlesBackground from '../components/Particles';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import WinnersSection from '../sections/WinnersSection';
import SponsorsSection from '../sections/SponsorsSection';
import EventsSection from '../sections/EventsSection';
import ContactSection from '../sections/ContactSection';
import "../styles/Hero.css"
import { PreviousEventsSection } from '../sections/PreviousEventsSection';
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);
const HomePageContainer = styled.div`
  position: relative;
  overflow: hidden;
`;
const HomePage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  // Use Framer Motion to create a smooth opacity transition based on scroll position
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  useEffect(() => {
    // GSAP animations setup
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
    return () => {
      // Clean up ScrollTriggers
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  return (
    <HomePageContainer ref={containerRef}>
      <motion.div style={{ opacity }}>
        <HeroSection />
      </motion.div>
      <AboutSection />
      <EventsSection />
      {/* <WinnersSection /> */}
      <PreviousEventsSection/>
      <SponsorsSection />
      <ContactSection />
      
    </HomePageContainer>
  );
};
export default HomePage;