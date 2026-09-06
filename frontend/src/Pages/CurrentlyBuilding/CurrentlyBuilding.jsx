import { useEffect, useRef, useState } from 'react'
import { CurrentlyBuildingRecords } from '../../data/currently-building/currently-building.data'
import CurrentlyBuildingCard from './CurrentlyBuildingCard'
import './CurrentlyBuilding.css'

export default function CurrentlyBuilding() {
    const gridRef = useRef(null)
    const [pageSize, setPageSize] = useState(1)
    const [firstItem, setFirstItem] = useState(0)
    const pageCount = Math.ceil(CurrentlyBuildingRecords.length / pageSize)
    const page = Math.min(Math.floor(firstItem / pageSize), Math.max(0, pageCount - 1))
    const start = page * pageSize

    useEffect(() => {
        const grid = gridRef.current
        if (!grid) return
        const observer = new ResizeObserver(([entry]) => {
            const styles = getComputedStyle(grid)
            const minWidth = parseFloat(styles.getPropertyValue('--building-card-min-width'))
            const gap = parseFloat(styles.columnGap) || 0
            const columns = Math.floor((entry.contentRect.width + gap) / (minWidth + gap))
            const maxColumns = window.matchMedia('(max-width: 639px)').matches ? 1 : 4
            setPageSize(Math.max(1, Math.min(maxColumns, columns)))
        })
        observer.observe(grid)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="building-section" id="currently-building" aria-labelledby="building-heading">
            <div className="building-inner">
                <header className="building-header">
                    <h2 id="building-heading">Currently Building</h2>
                </header>
                {CurrentlyBuildingRecords.length === 0 && <p className="building-empty">New projects are on the way. Check back soon.</p>}
                {pageCount > 0 && (
                    <div className="building-pager">
                        <div ref={gridRef} className="building-grid" id="building-projects" style={{ '--building-columns': pageSize }}>
                            {CurrentlyBuildingRecords.slice(start, start + pageSize).map(project => (
                                <CurrentlyBuildingCard key={project.id ?? project.title} {...project} />
                            ))}
                        </div>
                        <button className="building-previous" type="button" aria-label="Previous projects" aria-controls="building-projects" disabled={page === 0} onClick={() => setFirstItem((page - 1) * pageSize)}>
                            <span aria-hidden="true">←</span>
                        </button>
                        <span className="building-page-status" role="status" aria-live="polite" aria-atomic="true">
                            Page {page + 1} of {pageCount}
                        </span>
                        <button className="building-next" type="button" aria-label="Next projects" aria-controls="building-projects" disabled={page >= pageCount - 1} onClick={() => setFirstItem((page + 1) * pageSize)}>
                            <span aria-hidden="true">→</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}
