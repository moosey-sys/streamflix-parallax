import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="md:hidden">
        <button onClick={toggleSidebar} className="p-4 focus:outline-none">
          {isOpen ? <IoClose size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      <div
        className={`fixed inset-0 z-30 transform md:transform-none md:static transition-transform duration-200 ease-in-out bg-gray-200 text-black flex flex-col w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
          <li>
              <Link to="/userTable" className="text-lg hover:bg-gray-400 p-2 rounded-md block text-center">
                Users
              </Link>
            </li>
            <li>
              <Link to="/movies" className="text-lg hover:bg-gray-400 p-2 rounded-md block text-center">
                Movies
              </Link>
            </li>
            <li>
              <Link to="/tvshow" className="text-lg hover:bg-gray-400 p-2 rounded-md block text-center">
                TV Shows
              </Link>
            </li>
            <li>
              <Link to="/trending" className="text-lg hover:bg-gray-400 p-2 rounded-md block text-center">
                Trending
              </Link>
            </li>
            <li>
              <Link to="/order" className="text-lg hover:bg-gray-400 p-2 rounded-md block text-center">
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </div>
  
      {isOpen && <div className="fixed inset-0 z-20 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
