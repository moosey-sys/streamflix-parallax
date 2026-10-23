
"use client";

import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";


const UserTable = () => {
  const [movies, setMovies] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5002/api/getUsers");
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

  const deleteMovie = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5002/api/userDelete/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMovies(movies.filter(movie => movie._id !== userId));
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
       
      
        <Table>
          <Table.Head>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Passwords</Table.HeadCell>


            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {movies.map((data, index) => (
              <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {data.username}
                </Table.Cell>
                <Table.Cell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                  <div className="truncate">{data.email}</div>
                </Table.Cell>
                <Table.Cell>{data.password}</Table.Cell>
  
            
             
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

export default UserTable