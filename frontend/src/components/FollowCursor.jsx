import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Symbol = styled.div`
  position: fixed;      /* Fixed to viewport */
  pointer-events: none;
  user-select: none;
  z-index: 9999;        /* Very high z-index */
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: visible;

`

const Ball = styled.span`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  filter: blur(3px);
  transition: transform 0.4s ease;
  z-index: 10000;       /* Even higher to ensure it’s above container */
`;

const FollowCursor = () => {
  const squareOffset = 13; // distance from center for square corners

  // Positions of balls initially forming square exactly around the cursor
  const [ballPositions, setBallPositions] = useState({
    topLeft: { x: window.innerWidth / 2 - squareOffset, y: window.innerHeight / 2 - squareOffset },
    topRight: { x: window.innerWidth / 2 + squareOffset, y: window.innerHeight / 2 - squareOffset },
    bottomLeft: { x: window.innerWidth / 2 - squareOffset, y: window.innerHeight / 2 + squareOffset },
    bottomRight: { x: window.innerWidth / 2 + squareOffset, y: window.innerHeight / 2 + squareOffset },
  });

  // Center position for the background square (not needed to move container now)
  // Removed center state because Symbol is fixed and full screen

  // Store timeouts to clear later
  const timeouts = useRef([]);

  useEffect(() => {
    const clearTimeouts = () => {
      timeouts.current.forEach((t) => clearTimeout(t));
      timeouts.current = [];
    };

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;

      clearTimeouts();

      // Ball keys in order of movement
      const ballKeys = ["topLeft", "topRight", "bottomLeft", "bottomRight"];

      // Move balls one by one toward cursor (exact cursor point)
      ballKeys.forEach((ball, i) => {
        const timeoutId = setTimeout(() => {
          setBallPositions((prev) => ({
            ...prev,
            [ball]: { x: clientX, y: clientY },
          }));
        }, i * 1); // 1 ms delay between each
        timeouts.current.push(timeoutId);
      });

      // After all balls moved to cursor, spread back out to form square around cursor
      const resetTimeout = setTimeout(() => {
        setBallPositions({
          topLeft: { x: clientX - squareOffset, y: clientY - squareOffset },
          topRight: { x: clientX + squareOffset, y: clientY - squareOffset },
          bottomLeft: { x: clientX - squareOffset, y: clientY + squareOffset },
          bottomRight: { x: clientX + squareOffset, y: clientY + squareOffset },
        });
      }, ballKeys.length * 1 + 400); // 400ms after last ball moves in

      timeouts.current.push(resetTimeout);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeouts();
    };
  }, []);

  const colors = {
    topLeft: "blue",
    topRight: "red",
    bottomLeft: "yellow",
    bottomRight: "green",
  };

  return (
    <Symbol>
      {Object.entries(ballPositions).map(([key, pos]) => (
        <Ball
          key={key}
       className={`logo-${colors[key]}`}
          style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
        />
      ))}
    </Symbol>
  );
};

export default FollowCursor;
