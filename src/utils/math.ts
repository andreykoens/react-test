export const getWeightedRandom = (min: number, max: number): number => {
  return Math.round(max / (Math.random() * max + min))
}

export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min
}

export const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export const getRandomBoolean = (): boolean => {
  return Math.random() * 1 > 0.5
}

export const percentPartofTotal = (part: number, total: number) => {
  return (part / total) * 100
}

export const mapRange = (
  value: number,
  source: { start: number; stop: number },
  target: { start: number; stop: number }
): number => {
  return (
    target.start +
    (target.stop - target.start) * ((value - source.start) / (source.stop - source.start))
  )
}
