import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = ({ size = 28 }) => {
  return (
    <StyledSpinner size={size}>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="spinner-blade" />
      ))}
    </StyledSpinner>
  );
};

const fade = keyframes`
  0% { background-color: #69717d; }
  100% { background-color: transparent; }
`;

const StyledSpinner = styled.div`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  font-size: ${({ size }) => size}px;

  .spinner-blade {
    position: absolute;
    left: 0.4629em;
    bottom: 0;
    width: 0.074em;
    height: 0.2777em;
    border-radius: 0.0555em;
    background-color: transparent;
    transform-origin: center -0.2222em;
    animation: ${fade} 1s infinite linear;
  }

  ${[...Array(12)].map(
    (_, i) => `
    .spinner-blade:nth-child(${i + 1}) {
      animation-delay: ${(i * 0.083).toFixed(3)}s;
      transform: rotate(${i * 30}deg);
    }
  `
  )}
`;

export default Loader;
