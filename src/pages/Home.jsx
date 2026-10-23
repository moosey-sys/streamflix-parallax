import React from 'react'

import Trending from '../components/Trending'
import Movies from '../components/Movies'
import TVshows from '../components/TVshows'
import FAQ from '../components/FAQ'
import Navigation from '../components/navigation/Navigation'
import  Footer  from '../components/Footer'
import Poster from '../components/Poster'

const Home = () => {
  return (
    <div>
        <Navigation />
    <div className='bg-black'>
        <Poster/>
      <Trending/>
    <Movies/>
    <TVshows/>
    <FAQ/>
  
    </div>
    <Footer/>
    </div>
  )
}

export default Home
