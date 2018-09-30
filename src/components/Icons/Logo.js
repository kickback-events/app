import React from 'react'
import styled from 'react-emotion'

const SVG = styled('svg')`
  width: 40px;
  margin-left: -5px;
`

const Logo = ({ className }) => (
  <SVG
    viewBox="0 0 100 107"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="#FFF" fillRule="nonzero">
      <path d="M44.188 58.676c-3.7-3.7-3.7-9.7 0-13.4l28.9-28.9a9.476 9.476 0 0 1 13.4 13.4l-28.9 28.9c-3.7 3.7-9.7 3.7-13.4 0z" />
      <path d="M44.288 45.176c-3.7 3.7-3.7 9.7 0 13.4l28.9 28.9a9.476 9.476 0 0 0 13.4-13.4l-28.9-28.9c-3.7-3.7-9.7-3.7-13.4 0zM36.288 23.076c0-5.2-4.3-9.5-9.5-9.5s-9.5 4.3-9.5 9.5v58.2c0 5.2 4.3 9.5 9.5 9.5s9.5-4.3 9.5-9.5v-10.2c0-2.1-1.3-4.9-2.6-6.6l.1.1c-5.9-7.4-5.8-18 .1-25.4 1.2-1.5 2.4-3.4 2.4-5.5v-10.6z" />
    </g>
  </SVG>
)

export default Logo
