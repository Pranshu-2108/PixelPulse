"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


const Signup = () => {

  const [user, setUser] = useState({
      firstName : "",
      lastName : "",
      email : "",
      password : "",
  });

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const onSubmitHandler = async (e: any) => {
    try {
      e.preventDefault();

      if(user.firstName === "" || user.lastName === "" || user.email === "" || user.password === "")
      {
        setError("Some fields are Empty!");
        return;
      }

      const response = await axios.post("/api/user/signup", user);
      console.log("Signup Success", response.data);

      router.push("/login");

    } catch (error : any) {
      console.log("Signup Failed", error.message);
      setError("Unable to sign you Up, try again.");
    }
  }

  return (
    <div className="flex w-full">
        <form className="mx-auto mt-48 grid gap-4 items-center w-[20%]" onSubmit={onSubmitHandler}>
            <h1 className='m-auto text-2xl p-3 font-medium'>Sign Up</h1>
            <Input type="text" id="first_name" placeholder="First Name" onChange={(e : any) => setUser({...user , firstName : e.target.value})}/>
            <Input type="text" id="last_name" placeholder="Last Name" onChange={(e : any) => setUser({...user, lastName : e.target.value})}/>
            <Input type="email" id="email" placeholder="Email" onChange={(e : any) => setUser({...user, email : e.target.value})}/>
            <Input type="password" id="password" placeholder="Password" onChange={(e : any) => setUser({...user, password : e.target.value})}/>
            <Button type="submit">{loading ? "Submitting..." : "Submit"}</Button>
            <div className='text-sm text-red-500'>{error ? error : ""}</div>
        </form>
    </div>
  )
}

export default Signup