import * as React from "react"
const HeartSvg = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={130} height={130} {...props}>
    <path
      d="M65 29c-6-10-16-17-28-17C20 12 7 25 7 42c0 33 18 38 58 76 40-38 58-43 58-76 0-17-13-30-30-30-12 0-22 7-28 17z"
      style={{
        fill: "#ff0707",
      }}
    />
  </svg>
)
export default HeartSvg
