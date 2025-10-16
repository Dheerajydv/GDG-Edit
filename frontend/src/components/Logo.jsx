import React from 'react'
import "../styles/Logo.css"
import styled from 'styled-components'

const LogoContainer = styled.a`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
  
  @media (max-width: 1024px) {
    height: 36px;
  }
  
  @media (max-width: 768px) {
    height: 32px;
  }
  
  @media (max-width: 480px) {
    height: 28px;
  }
`

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`

const MainText = styled.span`
  font-family: 'Google Sans', 'Product Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.2;
  color: ${({theme})=>theme.colors.text.primary};
  letter-spacing: -0.01em;
  
  @media (max-width: 1024px) {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`

const SubText = styled.span`
  font-family: 'Google Sans', 'Product Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  line-height: 1.2;
  color: ${({theme})=>theme.colors.text.secondary || theme.colors.text.primary};
  opacity: 0.85;
  letter-spacing: -0.01em;
  
  @media (max-width: 1024px) {
    font-size: 0.65rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.55rem;
  }
`

export default function Logo() {
  return (
    <LogoContainer href='/' className='logo'>
      <LogoImage 
        src="/GDG-Logo.svg" 
        alt="GDG Logo"
      />
      <LogoText>
        <MainText>Google Developers Group</MainText>
        <SubText>On Campus Madan Mohan Malaviya University of Technology</SubText>
      </LogoText>
    </LogoContainer>
  )
}
