import React from 'react'
import "../styles/Logo.css"
import styled from 'styled-components'
const Symbol =styled.a`
width: fit-content;
  display: flex;
   align-items: center;
  font-family: 'Google Sans', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  gap: 0.4rem;
  color: ${({theme})=>theme.colors.text.primary};
  @media (max-width:768px){
    font-size: 1rem;
  }
`
export default function Logo() {
  return (
    <Symbol href='/' className='logo'>
                <div className="logo-colors">
                  <span className="logo-blue"></span>
                  <span className="logo-red"></span>
                  <span className="logo-yellow"></span>
                  <span className="logo-green"></span>
                </div>
                <span className="logo-text">GDG On Campus MMMUT</span>
    </Symbol>
  )
}
