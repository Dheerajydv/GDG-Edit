import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.colors.background.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    &:hover {
      color: ${({ theme }) => 
        theme.name === 'light' 
          ? theme.googleColors.blue.dark 
          : theme.googleColors.blue.primary
      };
    }
  }

  button, .button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    
    &:hover {
      background-color: ${({ theme }) => 
        theme.name === 'light' 
          ? theme.googleColors.blue.dark 
          : theme.googleColors.blue.light
      };
      box-shadow: 0 2px 4px ${({ theme }) => theme.colors.shadow};
    }
  }

  .card {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px ${({ theme }) => theme.colors.shadow};
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 8px ${({ theme }) => theme.colors.shadow};
    }
  }

  .section-title::after {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => 
      theme.name === 'light' 
        ? theme.googleColors.blue.dark 
        : theme.googleColors.blue.light
    };
  }
`;

export default GlobalStyles;