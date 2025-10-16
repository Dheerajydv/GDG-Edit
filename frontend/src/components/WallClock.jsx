import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ClockContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: radial-gradient(circle, #f8f9fa, #e8eaed);
`;

const ClockWrapper = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  background: linear-gradient(145deg, #ffffff, #e8eaed);
  border: 8px solid #dadce0;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const CenterDot = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: #202124;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const Hand = styled.div`
  position: absolute;
  width: 4px;
  background: #202124;
  border-radius: 2px;
  transform-origin: center bottom;
  top: 50%;
  left: 50%;
  transform: ${(props) => `rotate(${props.rotation}deg) translate(-50%, -100%)`};
`;

const HourHand = styled(Hand)`
  height: 70px;
  background: #202124;
`;

const MinuteHand = styled(Hand)`
  height: 100px;
  background: #5f6368;
`;

const SecondHand = styled(Hand)`
  height: 120px;
  background: #db4437;
`;

const Numbers = styled.div`
  position: absolute;
  font-size: 1.2rem;
  font-weight: bold;
  color: #202124;
  transform: ${(props) =>
    `rotate(${props.rotation}deg) translate(-50%, -140%) rotate(-${props.rotation}deg)`};
  top: 50%;
  left: 50%;
  text-align: center;
`;

const WallClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hourRotation = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  const minuteRotation = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const secondRotation = time.getSeconds() * 6;

  const numbers = [
    { label: "12", rotation: 0 },
    { label: "3", rotation: 90 },
    { label: "6", rotation: 180 },
    { label: "9", rotation: 270 },
  ];

  return (
    <ClockContainer>
      <ClockWrapper>
        {numbers.map((num, index) => (
          <Numbers key={index} rotation={num.rotation}>
            {num.label}
          </Numbers>
        ))}
        <HourHand rotation={hourRotation} />
        <MinuteHand rotation={minuteRotation} />
        <SecondHand rotation={secondRotation} />
        <CenterDot />
      </ClockWrapper>
    </ClockContainer>
  );
};

export default WallClock;
