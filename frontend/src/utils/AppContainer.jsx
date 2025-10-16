import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styled from 'styled-components'
import Space from '../components/Space'
import { Outlet } from 'react-router-dom'
import BackgroundParticles from '../components/BackgroundParticles'

const Container=styled.div`
    display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: background-color 0.3s ease;
`
const Main=styled.div`
flex: 1;
`
export default function AppContainer() {
  return (
          <Container>
            <BackgroundParticles />
            <Header />
            <Main>
              <Outlet />
            </Main>
            <Space />
            <Footer />
          </Container>
  )
}
