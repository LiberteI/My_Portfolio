import { CurrentlyBuildingRecords } from '../../data/currently-building/currently-building.data'
import CurrentlyBuildingCard from './CurrentlyBuildingCard'
import './CurrentlyBuilding.css'

export default function CurrentlyBuilding() {
    return (
        <section className="building-section" id="currently-building" aria-labelledby="building-heading">
            <div className="building-inner">
                <header className="building-header">
                    <h2 id="building-heading">Currently Building</h2>
                </header>
                {CurrentlyBuildingRecords.length === 0 && <p className="building-empty">New projects are on the way. Check back soon.</p>}
                <div className="building-grid">
                    {CurrentlyBuildingRecords.slice(0, 4).map(project => (
                        <CurrentlyBuildingCard key={project.id ?? project.title} {...project} />
                    ))}
                </div>
            </div>
        </section>
    )
}
