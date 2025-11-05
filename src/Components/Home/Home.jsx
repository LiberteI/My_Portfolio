import './Home.css'

import moon from '../../assets/City/bg/Moon.png'
import sky from '../../assets/City/bg/Sky.png'
import buildingBack from '../../assets/City/bg/buildingBack.png'
import buildingFar from '../../assets/City/bg/buildingFar.png'
import buildingMid from '../../assets/City/bg/buildingMid.png'
import buildingClose from '../../assets/City/bg/buildingClose.png'

const Home = () => {
    return(
        <main className='home'>
            <section className='home-scene'>
                
                <img className='home-bg-sky' src={sky} alt="sky" />
                <img className='home-bg-moon' src={moon} alt="moon" />
                <img className='home-bg-building-far' src={buildingFar} alt="Far skyline" />
                <img className='home-bg-building-mid' src={buildingMid} alt="Mid skyline" />
                <img className='home-bg-building-back' src={buildingBack} alt="Back skyline" />
                <img className='home-bg-building-close' src={buildingClose} alt="Close skyline" />
            </section>
        </main>
    )

}

export default Home
