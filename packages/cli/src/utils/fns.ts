const MAP_FONT_WEIGHTS = {
  'Light': 300,
  'Regular': 400,
  'Medium': 500,
  'Semi Bold': 600,
  'Bold': 700,
} satisfies Record<string, number>

export function pxToRem(px: number) {
  // If have px symbol, remove it.
  const pxValue = String(px).endsWith('px') ? String(px).slice(0, -2) : px
  // 2 decimal places
  return `${Number(pxValue) / 16}rem`
}

export function percentToEm(percent: number) {
  // 3 decimal places
  if (!percent)
    return percent
  // If have percent symbol, remove it.
  const percentValue = String(percent).endsWith('%')
    ? String(percent).slice(0, -1)
    : percent
  return `${(Number(percentValue) / 100).toFixed(3)}em`
}

export function fontWeightToNumber(fontWeight: string) {
  if (fontWeight in MAP_FONT_WEIGHTS)
    return MAP_FONT_WEIGHTS[fontWeight as keyof typeof MAP_FONT_WEIGHTS]
  else return fontWeight
}
