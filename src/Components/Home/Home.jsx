import './Home.css'

import moon from '../../assets/City/bg/Moon.png'
import sky from '../../assets/City/bg/Sky.png'

const Home = () => {
    return(
        <main className='home'>
            <section className='home-scene'>
                
                <img className='home-bg-sky' src={sky} alt="sky" />
                <img className='home-bg-moon' src={moon} alt="moon" />
            </section>
        </main>
    )
}

export default Home
