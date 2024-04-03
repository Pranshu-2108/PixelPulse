import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

export async function POST(request : NextRequest) {

    try {

        await connectToDatabase();

        const {email, password} = await request.json();

        //check if user exists
        const user = await User.findOne({ email : email});
        if(!user)
        {
            return NextResponse.json({error : "User doesn't Exists"}, {status : 400});
        }
        //console.log("User exists");

        //check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword)
        {
            return NextResponse.json({error : "Password is incorrect"}, {status : 400});
        }

        const token = await jwt.sign({email : user.email}, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        //console.log(token)
        const response = NextResponse.json({
            message : "Login Successful",
            success : true,
        })
        response.cookies.set("token", token, {
            //httpOnly: true,      
        })

        return response;
        
    } catch (error : any) {
        return NextResponse.json({error : error.message}, {status : 500})
    }
}