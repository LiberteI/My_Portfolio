import './Performance.css'
const Performace = () => {
    const performances = [
        {
            title: 'title1', 
            date: 'mar 13',
            description: 'this is a performace',
            link: '#',
            thumbnail: null,
        },
    ]
    const handleClick = () => {
        console.log("hello!");
    }
    return (
        <section className="performance"  id="performance">
            <h1>My Performances</h1>
            <div className="performance-grid" onClick={handleClick}>
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