import React from 'react'
import poster from '../assets/dune.jpg'

const Poster = () => {
  return (
    <div>
      <div className=' absolute ml-8'>
        <h1 className=' text-6xl text-white mb-4 mt-60 font-bold'>Dune: Part Two </h1>
        <p className='text-white w-[30%]'>The sequel to Dune (2021), it is the second of a two-part adaptation of the 1965 novel Dune by Frank Herbert. It follows Paul Atreides as he unites with the Fremen people of the desert planet Arrakis to wage war against House Harkonnen.</p>


     <div>
     <button className='w-32 h-12 rounded-lg bg-blue-500 text-white mt-8 mr-4'>Watch Now </button>

      <button className='w-32 h-12 rounded-lg bg-black text-white mt-8'>Explore More </button>
     </div>
      </div>
      <img src={poster} alt="" className=' mb-8' />
    </div>
  )
}

export default Poster
