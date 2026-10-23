import React from 'react';
import Navigation from '../components/navigation/Navigation';
import Footers from '../components/Footer';

const AboutUs = () => {
  const gradientStyle = {
    background: 'linear-gradient(135deg, #000000, #667eea, #764ba2)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    color: '#fff',
    textAlign: 'center',
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '2.5rem',
    marginBottom: '20px',
  };

  const paragraphStyle = {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '15px',
  };

  return (
    <div>
<Navigation />
    <div style={gradientStyle}>

      <div style={containerStyle}>
        <h1 style={headingStyle}><b>Welcome to Streamflix!!</b></h1>
        <p style={paragraphStyle}>Streamflix is not just a movie streaming platform; it's a gateway to a world of limitless entertainment. Founded in 2024, our platform has revolutionized the way people consume movies and TV shows.</p>
        <p style={paragraphStyle}>At Streamflix, we are committed to providing our subscribers with an unparalleled viewing experience. With a vast library of movies, TV series, documentaries, and original content, there's always something new to discover.</p>
        <p style={paragraphStyle}>Our team of dedicated curators ensures that only the best content makes it to your screens. Whether you're in the mood for a classic film, a gripping TV series, or an award-winning documentary, Streamflix has you covered.</p>
        <p style={paragraphStyle}>Join us on this cinematic journey and immerse yourself in a world of entertainment like never before. Get ready to stream, relax, and enjoy the show with Streamflix!</p>
      </div>
    </div>
    <Footers/>
    </div>
    
  );
};

export default AboutUs;
