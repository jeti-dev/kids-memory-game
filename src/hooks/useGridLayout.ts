import { useEffect, useRef, useState } from 'react'

/**
 * Picks a column/row split for `count` cells that (a) fills the container's
 * current width/height exactly via `fr` tracks (so it can never overflow and
 * force a scrollbar) and (b) keeps cells as close to square as possible.
 */
export function useGridLayout(count: number) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(() => Math.ceil(Math.sqrt(count)))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function recalc() {
      const { width, height } = el!.getBoundingClientRect()
      if (width === 0 || height === 0) return

      let bestCols = 1
      let bestScore = Infinity
      for (let c = 1; c <= count; c++) {
        const r = Math.ceil(count / c)
        const cellWidth = width / c
        const cellHeight = height / r
        const distortion = Math.abs(cellWidth - cellHeight) / Math.max(cellWidth, cellHeight)
        const emptyCells = c * r - count
        const score = distortion + emptyCells * 0.15
        if (score < bestScore) {
          bestScore = score
          bestCols = c
        }
      }
      setCols(bestCols)
    }

    recalc()
    const observer = new ResizeObserver(recalc)
    observer.observe(el)
    return () => observer.disconnect()
  }, [count])

  const rows = Math.ceil(count / cols)
  return { containerRef, cols, rows }
}
