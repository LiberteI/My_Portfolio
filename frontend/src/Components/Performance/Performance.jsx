import './Performance.css'
import { useState } from 'react'
const Performace = () => {
    // video array
    const [performances, setPerformances] = useState([]);
    // loading success error
    const [status, setStatus] = useState(null);

   
    
    return (
        <section className="performance"  id="performance">
            <h1>My Performances</h1>
            
            {status === 'loading' && <p>Loading Performances</p>}
            {status === 'error' && <p>Fail to load performances</p>}

            <div className="performance-grid">


                {/* loop through performances array and create performance cards */}
                { performances.map((performance) => (
                    <article className="performance-card" key={performance.title}>
                        <h3>{performance.title}</h3>
                        <p className="performance-date">{performance.date}</p>
                        <img className="performance-thumbnail" src={performance.thumbnail} alt="thumbnail" />
                        <p>{performance.description}</p>
                        {performance.link && (
                            <a href={performance.link} className="performance-link">View Details</a>
                        )}
                    </article>
                ))}


            </div>
        </section>
    )
}
export default Performace