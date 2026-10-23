import React from 'react'
import { movies } from "./data";

const Movies = () => {
  return (
    <div>
         <div className="flex ">
        {/* <h1>Movies</h1> */}
        {movies.map((data, index) => (
             <Card className="w-80 bg-gray-900 text-white">
             <img
               src={data.imageUrl}
               alt="Meaningful alt text for an image that is not purely decorative"
               className="h-48 w-full object-cover" 
             />
             <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
               {data.name}
             </h5>
             <p className="font-normal text-gray-700 dark:text-gray-400">
                {data.description}
             </p>
           </Card> 
        
        ) )}
    </div> 
    </div>
  )
}

export default Movies
