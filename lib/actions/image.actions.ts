"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError, toBase64 } from "../utils";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";

import { v2 as cloudinary } from 'cloudinary'

var ObjectId = require('mongodb').ObjectID;

const populateUser = (query: any) => query.populate({
  path: 'author',
  model: User,
  select: '_id firstName lastName email'
})

// ADD IMAGE
export async function addImage({ image, userEmail, path }: AddImageParams) {
  try {
    await connectToDatabase();
    console.log("hii")
    const author = await User.findOne({email : userEmail});
    console.log(author);
    if (!author) {
      throw new Error("User not found");
    }

    const newImage = await Image.create({
      ...image,
      author: author._id,
    })

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error)
  }
}

// UPDATE IMAGE
export async function updateImage({ image, userEmail, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);

    const author = await User.findOne({email : userEmail});

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== author._id) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    )

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error)
  }
}

// DELETE IMAGE
export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase();

    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error)
  } finally{
    redirect('/')
  }
}

// GET IMAGE
export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    const image = await populateUser(Image.findById(imageId));

    if(!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error)
  }
}

// GET IMAGES
export async function getAllImages({ limit = 9, page = 1, searchQuery = '' }: {
    limit?: number;
    page: number;
    searchQuery?: string;
  }) {
    try {
      await connectToDatabase();
  
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      })
  
      let expression = 'folder=PixelPulse';
  
      if (searchQuery) {
        expression += ` AND ${searchQuery}`
      }
  
      const { resources } = await cloudinary.search
        .expression(expression)
        .execute();
  
      const resourceIds = resources.map((resource: any) => resource.public_id);
  
      let query = {};
  
      if(searchQuery) {
        query = {
          publicId: {
            $in: resourceIds
          }
        }
      }
  
      const skipAmount = (Number(page) -1) * limit;
  
      const images = await populateUser(Image.find(query))
        .sort({ updatedAt: -1 })
        .skip(skipAmount)
        .limit(limit);
      
      const totalImages = await Image.find(query).countDocuments();
      const savedImages = await Image.find().countDocuments();
  
      return {
        data: JSON.parse(JSON.stringify(images)),
        totalPage: Math.ceil(totalImages / limit),
        savedImages,
      }
    } catch (error) {
      handleError(error)
    }
  }
  
  // GET IMAGES BY USER
  export async function getUserImages({
    limit = 9,
    page = 1,
    userId,
  }: {
    limit?: number;
    page: number;
    userId: string;
  }) {
    try {
      await connectToDatabase();
  
      const skipAmount = (Number(page) - 1) * limit;
      //const objectId = new ObjectId(userId.trim())
      //const objectId = new ObjectId(userId.trim());
      const images = await populateUser(Image.find({ author: userId }))
        .sort({ updatedAt: -1 })
        .skip(skipAmount)
        .limit(limit);

      const totalImages = await Image.find({ author: userId }).countDocuments();
  
      return {
        data: JSON.parse(JSON.stringify(images)),
        totalPages: Math.ceil(totalImages / limit),
      };
    } catch (error) {
      console.log(error);
    }
  }