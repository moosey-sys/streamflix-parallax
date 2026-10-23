
"use client";

import { Card } from "flowbite-react";
import image from '../assets/onepiece.avif'
import { useEffect, useState } from "react";
import Navigation from "./navigation/Navigation";
import Footers from "./Footer";
import { Link } from "react-router-dom";
// import { movies } from "./data";

const TVshows = () => {

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5002/api/getTvshows");
        if (response.ok) {
          const data = await response.json();
          setMovies(data);
          console.log('success');
        } else {
          console.log('fail');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
    
  return (
    <div className="w-screen mt-4">
      <h1 className="text-3xl text-white font-medium ml-4 mb-4">TV Shows</h1>

      <div className="flex mt-4 mb-4">
  
          <div className="flex mx-auto">
        {movies.slice(0, 4).map((movie, index)   => (
           <Link to={`/tvshowDetails/${movie._id}`} key={index} className="z-20">
           <Card className="w-80 bg-gray-900 text-white mx-8">
                  <img
                    src={movie.imageUrl}
                    alt="Meaningful alt text for an image that is not purely decorative"
                    className="h-48 w-full object-cover" 
                  />
              <div className="flex items-center justify-between">
              <h5 className="text-2xl font-bold tracking-tight text-white">
                {movie.title}
              </h5>
              <span className="text-white bg-yellow-400 w-16 h-6 rounded-sm text-center ">
                {movie.rating}
              </span>
              </div>
             
              <p className="font-normal w-64 h-24 text-white overflow-hidden text-ellipsis ">
                {movie.description}...
              </p>
              
            
              
            </Card>
            </Link>
          ))}
        </div>
      </div>  
  

       </div>  
   
  );
}
export default TVshows
