import React from 'react';

const videoModal = ({ videoId, onClose }) => {
  return (
    <div className=" w-screen h-screen">
      <div className="w-screen h-screen ab">
        <iframe
          title="Trailer"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default videoModal;
