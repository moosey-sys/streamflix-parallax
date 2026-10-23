import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditTrending = () => {
    const { movieId } = useParams();
    const [formData, setFormData] = useState({
        imageUrl: '',
        title: '',
        cast: '',
        description: '',
        duration: '',
        genre: '',
        rating: '',
        releaseDate: '',
        video: ''
    });

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5002/api/getTrending/${movieId}`);
                if (response.status === 200) {
                    setFormData(response.data);
                }
            } catch (error) {
                console.error('Error fetching movie data:', error);
            }
        };
        fetchMovieData();
    }, [movieId]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formDataToSend = new FormData();
            if (event.target.elements.file.files.length > 0) {
                formDataToSend.append('file', event.target.elements.file.files[0]);
                formDataToSend.append('upload_preset', 'dfpve4f1');
                const response = await axios.post('https://api.cloudinary.com/v1_1/dov1eqbcn/image/upload', formDataToSend);
                if (response.status === 200) {
                    const imageUrl = response.data.secure_url;
                    formData.imageUrl = imageUrl;
                }
            }
            
            const backendResponse = await axios.put(`http://127.0.0.1:5002/api/trendingEdit/${movieId}`, formData);
            console.log('Backend response:', backendResponse.data);
        } catch (error) {
            console.error('Error updating movie:', error);
            if (error.response) {
                console.log('Backend response:', error.response.data);
            }
        }
    };

    return (
        <div>
            <div>
                <h1 className='text-3xl font-bold text-center my-8'>Edit Trending Data</h1>
            </div>
            <form className="max-w-md mx-auto border border-gray-400 rounded-lg mb-8 p-8" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
                    <input type="file" id="file" name='file' onChange={handleChange} className="shadow-sm border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" />
                </div>
                <div className="mb-5">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Movie Title</label>
                    <input type="text" id="title" name='title' value={formData.title} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="cast" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cast</label>
                    <input type="text" id="cast" name='cast' value={formData.cast} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                    <input type="text" id="description" name='description' value={formData.description} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration</label>
                    <input type="text" id="duration" name='duration' value={formData.duration} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="genre" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Genre</label>
                    <input type="text" id="genre" name='genre' value={formData.genre} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
                    <input type="text" id="rating" name='rating' value={formData.rating} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="releaseDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Release Date</label>
                    <input type="date" id="releaseDate" name='releaseDate' value={formData.releaseDate} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="video" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Video URL</label>
                    <input type="text" id="video" name='video' value={formData.video} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
    );
}

export default EditTrending;
