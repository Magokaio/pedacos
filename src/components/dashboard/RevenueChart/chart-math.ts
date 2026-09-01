export interface Point2D {
  x: number
  y: number
}

/** Arredonda os ticks do eixo Y para números "limpos" (ex.: 0, 10.000, 20.000...). */
export function getNiceTicks(maxValue: number, tickCount = 4): number[] {
  if (maxValue <= 0) return [0]

  const rawStep = maxValue / tickCount
  const exponent = Math.floor(Math.log10(rawStep))
  const magnitude = 10 ** exponent
  const residual = rawStep / magnitude

  let niceResidual: number
  if (residual <= 1) niceResidual = 1
  else if (residual <= 2) niceResidual = 2
  else if (residual <= 2.5) niceResidual = 2.5
  else if (residual <= 5) niceResidual = 5
  else niceResidual = 10

  const step = niceResidual * magnitude
  const niceMaxValue = Math.ceil(maxValue / step) * step

  const ticks: number[] = []
  for (let value = 0; value <= niceMaxValue + step / 2; value += step) {
    ticks.push(Math.round(value))
  }
  return ticks
}

/** Constrói uma curva suave (Catmull-Rom -> Bézier) passando por todos os pontos. */
export function buildSmoothPath(points: Point2D[]): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let path = `M ${points[0].x} ${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }

  return path
}
