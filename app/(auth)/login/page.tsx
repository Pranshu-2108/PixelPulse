"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import axios from "axios";
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const Login = () => {

  const [user, setUser] = useState({
      email : "",
      password : "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const router = useRouter();
  
  const onSubmitHandler = async (e : any) => {
      
      try {
        e.preventDefault();
        setLoading(true);
        const response = await axios.post("/api/user/login", user);
        console.log("Login success", response.data);
        console.log("navigating");
        router.push("/");

      } catch (error : any) {
        console.log("Login Failed", error.message);
        setError("Invalid username or password");
        setLoading(false);
      }
  }

  return (
    <div className="flex w-full">
        <form className="mx-auto mt-48 grid gap-5 items-center w-[20%]" onSubmit={onSubmitHandler}>
            <h1 className='m-auto text-3xl font-bold p-2 font-medium mb-2'>Login</h1>
            <Input type="email" id="email" placeholder="Email" onChange={(e : any) => setUser({...user, email : e.target.value})}/>
            <Input type="password" id="password" placeholder="Password" onChange={(e : any) => setUser({...user, password : e.target.value})}/>
            <div>
              <Button type="submit" className='w-full mb-4'>{loading ? "Submitting..." : "Submit"}</Button>
              <div className='flex text-[13px] mb-2 text-center mx-auto'>
                <p className='ml-1 font-semibold'>Don&apos;t have an account?</p>
                <span className='ml-2 mr-1 text-blue-500 font-semibold'><a href="/signup">Sign Up</a></span>
              </div>
              <div className='text-red-500 text-sm ml-1'>{error ? error : ""}</div>
            </div>
        </form>
    </div>
  )
}

export default Login