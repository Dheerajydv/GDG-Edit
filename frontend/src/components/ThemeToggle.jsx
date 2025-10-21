import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaRegSun, FaSun } from 'react-icons/fa';
import { Moon } from 'lucide-react';

const ToggleButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: transparent; /* transparent background */
  border: none;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1); /* subtle hover effect */
    @media (max-width:768px) {
      height: 2rem;
      width: 2rem;
    }
  }
`;

const ThemeToggle = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <ToggleButton
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      initial={{ rotate: 0 }}
      animate={{ rotate: isDarkTheme ? 0 : 180 }}
      transition={{ duration: 0.5 }}
      aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkTheme ? <FaSun size={20} /> : <Moon size={20} />}
    </ToggleButton>
  );
};

export default ThemeToggle;