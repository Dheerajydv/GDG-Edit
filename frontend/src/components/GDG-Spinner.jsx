"use client"
import { motion } from "framer-motion"
import styled, { keyframes } from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f9fafb; /* gray-50 */
  position: relative;
`

const PulsingCircle = styled(motion.div)`
  position: absolute;
  width: 8rem;   /* 32 */
  height: 8rem;
  background-color: #bfdbfe; /* blue-100 */
  border-radius: 9999px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const DotsContainer = styled(motion.div)`
  display: flex;
  gap: 0.75rem; /* space-x-3 */
  position: relative;
  z-index: 10;
`

const Dot = styled(motion.div)`
  width: 1rem;   /* 4 */
  height: 1rem;
  border-radius: 9999px;
  background-color: ${({ color }) => color};
`

const TextContainer = styled(motion.div)`
  margin-top: 2rem;
  text-align: center;
`

const Heading = styled.h2`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  color: #1f2937; /* gray-800 */
  margin-bottom: 0.5rem;
`

const Paragraph = styled(motion.p)`
  color: #4b5563; /* gray-600 */
`

const ProgressWrapper = styled(motion.div)`
  margin-top: 1.5rem;
  width: 12rem; /* 48 */
  height: 0.25rem; /* 1 */
  background-color: #e5e7eb; /* gray-200 */
  border-radius: 9999px;
  overflow: hidden;
`

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    #3b82f6,  /* blue-500 */
    #ef4444,  /* red-500 */
    #facc15,  /* yellow-500 */
    #22c55e   /* green-500 */
  );
`

export default function Spinner() {
  const colors = [
    "#3b82f6", // blue-500
    "#ef4444", // red-500
    "#facc15", // yellow-500
    "#22c55e", // green-500
  ]

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
        repeat: Infinity,
        repeatType: "loop",
        duration: 2,
      },
    },
  }

  const dotVariants = {
    initial: {
      y: 0,
      scale: 1,
    },
    animate: {
      y: [-20, 0, -20],
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.7, 0.3, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  return (
    <Container>
      <PulsingCircle
        variants={pulseVariants}
        animate="animate"
      />
      <DotsContainer variants={containerVariants} animate="animate">
        {colors.map((color, index) => (
          <Dot
            key={index}
            color={color}
            variants={dotVariants}
            initial="initial"
            animate="animate"
          />
        ))}
      </DotsContainer>

      <TextContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Heading>Google Developer Groups</Heading>
        <Paragraph
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading amazing content...
        </Paragraph>
      </TextContainer>

      <ProgressWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ProgressBar
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </ProgressWrapper>
    </Container>
  )
}
