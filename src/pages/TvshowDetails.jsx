'use client'
import React, { useEffect, useState } from 'react'
import dune from '../assets/dune.jpg'
import { Link, useParams } from 'react-router-dom';

const TvshowDetails = () => {
    const { id } = useParams();
    console.log('ID:', id);
    const [movie, setMovie] = useState([]);

   
    useEffect(() => {
      const fetchMovie = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5002/api/getTvshows/${id}`);
          if (!response.ok) {
            throw new Error('Movie not found');
          }
          const data = await response.json();
          setMovie(data);

        } catch (error) {
          console.error('Error fetching movie:', error);

        }
      };
  
      fetchMovie();
    }, [id]);

    const addToFavorites = async (movieId) => {
      try {
        const userID = sessionStorage.getItem("userID")
        console.log(movieId)
        console.log(userID)
        const response = await fetch(`http://127.0.0.1:5002/api/addToFavorites/${movieId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
    
          body: JSON.stringify({ userID }),
        });
        if (response.ok) {
        
          console.log("Movie added to favorites!");
        } else {
          console.error("Failed to add movie to favorites");
        }
      } catch (error) {
        console.error("Error adding movie to favorites:", error);
      }
    };
    


  return (
    <div>
      <div className='relative'>
        <div className=' w-screen  flex justify-between absolute mt-80'>
        <div className=' ml-8 z-50 '>
        <h1 className=' text-6xl text-white mb-4  font-bold'>{movie.title}</h1>
        <p className='text-white w-[50%]'>{movie.description}</p>
        

<div class="flex items-center mt-4">
<span className=' text-white '>Rating: </span>
    <svg class="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <svg class="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <svg class="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <svg class="w-4 h-4 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    <svg class="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
    </svg>
    
    <span className="text-white bg-yellow-400 w-12 h-6 rounded-sm text-center  ml-2 ">
                {movie.rating}
          
              </span> 
</div>

       <br />
        <Link to={`/play/${movie.video}`} className="bg-blue-600 rounded-lg w-32 h-10 mt-4 text-white py-3 px-4">
             Play Now
            </Link>   
            <button
                  className="bg-blue-400 rounded-lg w-32 h-10 z-50 ml-8"
                  onClick={() => addToFavorites(movie._id)}
                >
                  Add to Favorite
                </button>
                 </div>
        <div className=' mr-16 ml-32 z-50 '>
            <p className=' text-white mb-4 mt-20'>Cast: {movie.cast}</p>
            <p className='text-white'>Genre: {movie.genre}</p>
        </div>
        </div>
       
  <img src={movie.imageUrl} alt="dune" className=' w-screen h-screen bg-cover' />
  <div className='absolute bottom-0 left-0 w-full h-[80%] bg-gradient-to-t from-black to-transparent'></div>
</div>

    </div>
  )
}

export default TvshowDetails
