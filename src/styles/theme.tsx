'use client'
import { extendTheme, keyframes } from '@chakra-ui/react'
import { getRandomBoolean, getRandomInt, percentPartofTotal } from 'utils/math'

export const randomDrift = (strength: number, speed: number): string => {
  let keys = ''
  for (let i = 0; i < getRandomInt(1, 3) + 1; i++) {
    keys += `${String(getRandomInt(0, 100))}% {
        transform:
          translate(
            ${String(getRandomInt(-strength, strength))}px,
            ${String(getRandomInt(-strength, strength))}px
          )
          rotate(${String(getRandomInt(-strength, strength))}deg);
        }`
  }
  const keyf = keyframes`${keys}`
  const animation = `${keyf}
    infinite
    ${speed}ms
    ${getRandomBoolean() ? 'alternate' : 'alternate-reverse'}
    linear`
  return animation
}

export const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
})

export const randomJump = (delayMin: number, delayMax: number): string => {
  const waitTime = getRandomInt(delayMin, delayMax)
  const animTime = 660
  const step = 660 / 30
  const totalTime = waitTime + animTime
  const keyf = keyframes`
      ${percentPartofTotal(waitTime + step * 0, totalTime)}% { transform:translateY(0%); }
      ${percentPartofTotal(waitTime + step * 10, totalTime)}% { transform:translateY(-15%); }
      ${percentPartofTotal(waitTime + step * 20, totalTime)}% { transform:translateY(0%); }
      ${percentPartofTotal(waitTime + step * 25, totalTime)}% { transform:translateY(-7%); }
      ${percentPartofTotal(waitTime + step * 27, totalTime)}% { transform:translateY(0%); }
      ${percentPartofTotal(waitTime + step * 29, totalTime)}% { transform:translateY(-3%); }
      ${percentPartofTotal(waitTime + step * 30, totalTime)}% { transform:translateY(0); }
  `
  const animation = `${keyf}
    infinite
    ${waitTime + animTime}ms
    ease`
  return animation
}
