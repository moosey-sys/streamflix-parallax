
"use client";

import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";


const OrderTable = () => {
  const [movies, setMovies] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5002/api/orders");
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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-x-auto p-4">
        
      
        <Table>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Payment Method</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Subscription</Table.HeadCell>


            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {movies.map((data, index) => (
              <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {data._id}
                </Table.Cell>
                <Table.Cell className="overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                  <div className="truncate">{data.email}</div>
                </Table.Cell>
                <Table.Cell>{data.payment_method}</Table.Cell>
                <Table.Cell>{data.date}</Table.Cell>
                <Table.Cell>{data.subscription}</Table.Cell>
  
            
             
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

export default OrderTable