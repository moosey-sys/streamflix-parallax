
"use client";

import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";


const MovieTable = () => {
  const [movies, setMovies] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5002/api/getMovies");
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

  const deleteMovie = async (movieId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5002/api/movieDelete/${movieId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMovies(movies.filter(movie => movie._id !== movieId));
        console.log('Movie deleted successfully');
      } else {
        console.log('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-x-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Movies</h2>
        <div className=" mb-4">
        <a href="/movieform" className=" bg-blue-500 text-white rounded-sm p-2 ">
          Add Movie
        </a>
        </div>
      
        <Table>
          <Table.Head>
            <Table.HeadCell>Movie Title</Table.HeadCell>
            <Table.HeadCell>Genre</Table.HeadCell>
            <Table.HeadCell>Released Date</Table.HeadCell>
            <Table.HeadCell>Duration</Table.HeadCell>
            <Table.HeadCell>Cast</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Rating</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {movies.map((data, index) => (
              <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {data.title}
                </Table.Cell>
                <Table.Cell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                  <div className="truncate">{data.genre}</div>
                </Table.Cell>
                <Table.Cell>{data.releaseDate}</Table.Cell>
                <Table.Cell>{data.duration}</Table.Cell>
                <Table.Cell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                  <div className="truncate">{data.cast}</div>
                </Table.Cell>
                <Table.Cell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                  <div className="truncate">{data.description}</div>
                </Table.Cell>
                <Table.Cell>{data.rating}</Table.Cell>
                <Table.Cell>
                  <Link to={`/editMovie/${data._id}`}   className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                    Edit
                  </Link>
                </Table.Cell>
                <Table.Cell>
                <a href="#" className="font-medium text-red-600 hover:underline" onClick={() => deleteMovie(data._id)}>
                    Delete
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

export default MovieTable