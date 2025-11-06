import './Performance.css'
import { useEffect, useState } from 'react'
const Performace = () => {
    // video array
    const [performances, setPerformances] = useState([]);
    // loading success error
    const [status, setStatus] = useState('idle');

    useEffect(() =>{
        const fetchVideo = async () => {
            setStatus('loading');

            try{
                const response = await fetch('http://localhost:8080/api/youtube');
                if(!response.ok){
                    throw new Error('Request failed');
                }
                // get json data
                const data = await response.json();
                
                let items = [];
                if(data && Array.isArray(data.videos)){
                    items = data.videos;
                }
                // get title, date, thumbnail, description from data
                setPerformances(items);
                setStatus('success');
            } catch(error){
                console.error(error);
                setStatus('error');
            }
        }
        fetchVideo();
        //[]: to run once
    }, [])
   
    
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
                        {/* <p className="performance-date">{performance.date}</p> */}
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