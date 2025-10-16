import React from 'react'
import styled from 'styled-components'

const Logo=styled.div`
  display: flex;
  span{
    width: 25%;
    padding: 0.1rem;
  display: block;
  }
  :nth-child(1){
    background-color: #4285F4;
  }
  :nth-child(2){
     background-color: #DB4437;
  }
  :nth-child(3){
    background-color: #F4B400;
  }
  :nth-child(4){
    background-color: #0F9D58;
  }
`
export default function Space() {
  return (
    <Logo>
        <span ></span>
        <span ></span>
        <span ></span>
        <span ></span>
      </Logo>
  )
}
