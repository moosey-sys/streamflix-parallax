import axios from 'axios';

import React, { useState } from 'react'


const MovieForm = () => {

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
            formDataToSend.append('file', event.target.elements.file.files[0]); 
            formDataToSend.append('upload_preset', 'dfpve4f1');
            const response = await axios.post('https://api.cloudinary.com/v1_1/dov1eqbcn/image/upload', formDataToSend);
            if (response.status === 200) {
                const imageUrl = response.data.secure_url;
                const updatedFormData = {
                    ...formData,
                    imageUrl: imageUrl
                  };
          
                console.log(updatedFormData)
                const backendResponse = await axios.post('http://127.0.0.1:5002/api/movieUpload', updatedFormData);
                console.log('Backend response:', backendResponse.data);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
  console.log('Cloudinary response:', error.response.data);
        }
    };
  return (
    <div>
            <div>
                <h1 className=' text-3xl font-bold text-center my-8'>Add Movie Data</h1>
            </div>
        <form class="max-w-md mx-auto border border-gray-400 rounded-lg mb-8 p-8" onSubmit={handleSubmit}>
        <div className="mb-5 ">
                    <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
                    <input type="file" id="file" name='file' onChange={handleChange} className="shadow-sm  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
        <div class="mb-5">
            <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Movie Title</label>
            <input type="text" id="title" name='title' onChange={handleChange}  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="enter" required />
        </div>
        <div class="mb-5">
            <label for="cast" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cast</label>
            <input type="text" id="cast" name='cast' onChange={handleChange}  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        <div class="mb-5">
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
            <input type="text" id="description" name='description' onChange={handleChange}  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        <div class="mb-5">
            <label for="duration" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Duration</label>
            <input type="text" id="duration" name='duration' onChange={handleChange}  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        <div class="mb-5">
            <label for="genre" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Genre</label>
            <input type="text" id="genre" name='genre' onChange={handleChange}  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        <div class="mb-5">
            <label for="rating" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
            <input type="text" id="rating" name='rating' onChange={handleChange}  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        <div class="mb-5">
            <label for="releaseDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Release Date</label>
            <input type="date" id="releaseDate" name='releaseDate' onChange={handleChange}  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        <div class="mb-5">
            <label for="video" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Video URL</label>
            <input type="video" id="video" name='video' onChange={handleChange}  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
        </div>
        
       


        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </form>

    </div>
  )
}

export default MovieForm
