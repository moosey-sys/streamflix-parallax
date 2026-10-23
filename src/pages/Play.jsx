import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Play = () => {
    const { id } = useParams();
    useEffect(() => {
        console.log('id:', id); // Log after id is available
    }, [id]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full max-w-3xl"
      ></iframe>
    </div>
  );
}

export default Play;
