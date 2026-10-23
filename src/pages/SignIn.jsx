'use client'
import React, { useState } from 'react';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await fetch('http://127.0.0.1:5002/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {

        const data = await response.json();
        console.log(data);

        sessionStorage.setItem('userID', data.user_id);
        sessionStorage.setItem('email', email);

        navigate("/");
      } else {

        const errorData = await response.json();
        console.error('Sign-in failed:', errorData.message);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form className="flex w-96 flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="enter your email"
            required
            shadow
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Your password" />
          </div>
          <TextInput
            id="password"
            type="password"
            required
            shadow
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      
      
        <Button type="submit"  className=" bg-blue-700">
          Login
        </Button>
      </form>
    </div>
  );
};

export default SignIn;

