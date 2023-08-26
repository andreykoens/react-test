'use client'
import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
})

export const getRandom = (from, to) => {
  return Math.floor(Math.random() * (to - from)) + from
}
export const randomDrift = (strength: number) => {
  let keys = ''
  for (let i = 0; i < getRandom(2, 3); i++) {
    keys += `${getRandom(0, 100)}% { transform: translate(${getRandom(
      -strength,
      strength
    )}px, ${getRandom(-strength, strength)}px) rotate(${getRandom(-strength, strength)}deg);}`
  }
  return keys
}
