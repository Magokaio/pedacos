import { ArrowDown, ArrowUp } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import { bucketInvoices } from './bucket-invoices'
import { buildSmoothPath, getNiceTicks } from './chart-math'
import { formatCompactCurrency, formatCurrency } from './format'
import type { Invoice, PeriodKey } from './types'

const VIEW_HEIGHT = 220
const PAD_LEFT = 56
const PAD_RIGHT = 12
const PAD_TOP = 16
const PAD_BOTTOM = 28
const PLOT_HEIGHT = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM
const BASELINE_Y = PAD_TOP + PLOT_HEIGHT

const periodOptions: { key: PeriodKey; label: string }[] = [
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mês' },
  { key: 'ano', label: 'Ano' },
]

const periodDescriptions: Record<PeriodKey, string> = {
  semana: 'Últimos 7 dias',
  mes: 'Últimas 4 semanas',
  ano: 'Últimos 12 meses',
}

interface RevenueChartProps {
  invoices: Invoice[]
}

export function RevenueChart({ invoices }: RevenueChartProps) {
  const [period, setPeriod] = useState<PeriodKey>('mes')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(640)

  // Mede o próprio contêiner e desenha o SVG em pixels reais (em vez de deixar
  // o viewBox escalar via CSS) — assim o texto dos eixos nunca fica minúsculo
  // em telas pequenas, ele só reflui/oculta rótulos quando falta espaço.
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const updateWidth = () => setChartWidth(el.clientWidth)
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function handlePeriodChange(next: PeriodKey) {
    setPeriod(next)
    setHoveredIndex(null)
  }

  const { points: rawPoints, previousTotal } = useMemo(
    () => bucketInvoices(period, invoices),
    [period, invoices],
  )

  const plotWidth = Math.max(chartWidth - PAD_LEFT - PAD_RIGHT, 1)

  const { points, ticks, linePath, areaPath } = useMemo(() => {
    const maxValue = Math.max(...rawPoints.map((point) => point.value), 0)
    const niceTicks = getNiceTicks(maxValue)
    const niceMaxValue = niceTicks[niceTicks.length - 1] || 1

    const plottedPoints = rawPoints.map((point, index) => ({
      ...point,
      x:
        rawPoints.length === 1
          ? PAD_LEFT + plotWidth / 2
          : PAD_LEFT + (index / (rawPoints.length - 1)) * plotWidth,
      y: PAD_TOP + PLOT_HEIGHT - (point.value / niceMaxValue) * PLOT_HEIGHT,
    }))

    const line = buildSmoothPath(plottedPoints)
    const first = plottedPoints[0]
    const last = plottedPoints[plottedPoints.length - 1]
    const area = first && last ? `${line} L ${last.x} ${BASELINE_Y} L ${first.x} ${BASELINE_Y} Z` : ''

    return { points: plottedPoints, ticks: niceTicks, linePath: line, areaPath: area }
  }, [rawPoints, plotWidth])

  const total = points.reduce((sum, point) => sum + point.value, 0)
  const deltaPct = previousTotal > 0 ? ((total - previousTotal) / previousTotal) * 100 : null
  const isUp = (deltaPct ?? 0) >= 0
  const hasData = invoices.length > 0

  const hovered = hoveredIndex !== null ? points[hoveredIndex] : null
  // Em telas estreitas, com muitos pontos (ex.: 12 meses), mostra só um rótulo a cada dois.
  const labelEvery = points.length > 6 && chartWidth < 480 ? 2 : 1

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg || points.length === 0) return

    const rect = svg.getBoundingClientRect()
    const dataX = event.clientX - rect.left
    const fraction = (dataX - PAD_LEFT) / plotWidth
    const index = Math.round(fraction * (points.length - 1))
    setHoveredIndex(Math.min(points.length - 1, Math.max(0, index)))
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setHoveredIndex((current) => Math.min(points.length - 1, (current ?? -1) + 1))
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setHoveredIndex((current) => Math.max(0, (current ?? points.length) - 1))
    } else if (event.key === 'Escape') {
      setHoveredIndex(null)
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50">
            Faturamento
          </h2>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-semibold text-stone-900 dark:text-stone-50 sm:text-3xl">
              {formatCurrency(total)}
            </span>
            {deltaPct !== null && (
              <span
                className={[
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  isUp
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
                ].join(' ')}
              >
                {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(deltaPct).toFixed(1)}%
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
            {periodDescriptions[period]} · comparado ao período anterior
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Período do gráfico de faturamento"
          className="inline-flex self-start rounded-lg border border-stone-200 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-950"
        >
          {periodOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              role="tab"
              aria-selected={period === option.key}
              onClick={() => handlePeriodChange(option.key)}
              className={[
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                period === option.key
                  ? 'bg-white text-stone-900 shadow-sm dark:bg-stone-800 dark:text-stone-50'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50',
              ].join(' ')}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="relative mt-6">
        {!hasData ? (
          <div
            style={{ height: VIEW_HEIGHT }}
            className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-stone-200 text-center dark:border-stone-800"
          >
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
              Nenhuma fatura cadastrada ainda
            </p>
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Adicione faturas abaixo para ver o gráfico
            </p>
          </div>
        ) : (
          <>
            <svg
              ref={svgRef}
              width={chartWidth}
              height={VIEW_HEIGHT}
              viewBox={`0 0 ${chartWidth} ${VIEW_HEIGHT}`}
              className="block touch-none select-none"
              role="img"
              aria-label={`Gráfico de faturamento, ${periodDescriptions[period].toLowerCase()}`}
              tabIndex={0}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(points.length - 1)}
              onBlur={() => setHoveredIndex(null)}
              onKeyDown={handleKeyDown}
            >
              <defs>
                <linearGradient id="revenue-area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopOpacity={0.18}
                    className="[stop-color:#b45309] dark:[stop-color:#f59e0b]"
                  />
                  <stop
                    offset="100%"
                    stopOpacity={0}
                    className="[stop-color:#b45309] dark:[stop-color:#f59e0b]"
                  />
                </linearGradient>
              </defs>

              {ticks.map((tick) => {
                const y =
                  PAD_TOP + PLOT_HEIGHT - (tick / (ticks[ticks.length - 1] || 1)) * PLOT_HEIGHT
                return (
                  <g key={tick}>
                    <line
                      x1={PAD_LEFT}
                      x2={chartWidth - PAD_RIGHT}
                      y1={y}
                      y2={y}
                      strokeWidth={1}
                      className="stroke-stone-200 dark:stroke-stone-800"
                    />
                    <text
                      x={PAD_LEFT - 8}
                      y={y}
                      textAnchor="end"
                      dominantBaseline="middle"
                      className="fill-stone-400 text-[10px] dark:fill-stone-500"
                    >
                      {formatCompactCurrency(tick)}
                    </text>
                  </g>
                )
              })}

              {points.map(
                (point, index) =>
                  (index % labelEvery === 0 || index === points.length - 1) && (
                    <text
                      key={point.label}
                      x={point.x}
                      y={VIEW_HEIGHT - 8}
                      textAnchor="middle"
                      className="fill-stone-400 text-[10px] dark:fill-stone-500"
                    >
                      {point.label}
                    </text>
                  ),
              )}

              <path d={areaPath} fill="url(#revenue-area-fill)" stroke="none" />

              <path
                d={linePath}
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-amber-700 dark:stroke-amber-500"
              />

              {points.map((point, index) => (
                <circle
                  key={point.label}
                  cx={point.x}
                  cy={point.y}
                  r={index === hoveredIndex ? 5 : 4}
                  strokeWidth={2}
                  className={[
                    'fill-amber-700 stroke-white transition-opacity dark:fill-amber-500 dark:stroke-stone-900',
                    index === points.length - 1 || index === hoveredIndex
                      ? 'opacity-100'
                      : 'opacity-0',
                  ].join(' ')}
                />
              ))}

              {hovered && (
                <line
                  x1={hovered.x}
                  x2={hovered.x}
                  y1={PAD_TOP}
                  y2={BASELINE_Y}
                  strokeWidth={1}
                  className="stroke-stone-300 dark:stroke-stone-700"
                />
              )}
            </svg>

            {hovered && (
              <div
                className="pointer-events-none absolute z-10 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm whitespace-nowrap shadow-md dark:border-stone-700 dark:bg-stone-800"
                style={{
                  left: hovered.x,
                  top: hovered.y,
                  transform: 'translate(-50%, calc(-100% - 12px))',
                }}
              >
                <div className="text-xs text-stone-500 dark:text-stone-400">{hovered.label}</div>
                <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-50">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-amber-700 dark:bg-amber-500" />
                  {formatCurrency(hovered.value)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Versão em tabela dos mesmos dados, para leitores de tela / navegação sem mouse. */}
      {hasData && (
        <table className="sr-only">
          <caption>Faturamento, {periodDescriptions[period].toLowerCase()}</caption>
          <thead>
            <tr>
              <th scope="col">Período</th>
              <th scope="col">Faturamento</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.label}>
                <td>{point.label}</td>
                <td>{formatCurrency(point.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
