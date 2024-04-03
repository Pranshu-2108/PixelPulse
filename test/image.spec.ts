"use server"

import User from "../lib/database/models/user.model";
import { testing } from "../lib/actions/test.action";
import { describe, expect, it, vi } from "vitest";
import { addImage, deleteImage } from "../lib/actions/image.actions";
import Image from "../lib/database/models/image.model";
import mongoose from "mongoose";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import Sinon from "sinon";

describe("this is test function", () => {
  it("test should return OK", () => {
    const output = testing();
    expect(output).toBe("OK");
  });
});


describe("testing addImage action", () => {

  it("addImage should return OK", async () => {

    const mockUser = {
      _id: "1",
      email: "hello@gmail.com",
      firstName: "hello",
      lastName: "World",
      password: "123456",
      planId: "1",
      creditBalance: 7,
    };
    const userModelMock = {
      findOne: () => Promise.resolve(mockUser)
    };

    const connection = {
      connect: () => ({
        exec: () => Promise.resolve(true)
      })
    }

    Object.assign(mongoose, connection);

    const validation = () => Promise.resolve(true);

    Object.assign(revalidatePath, Promise.resolve(true));

    Object.assign(revalidateTag, validation);

    Object.assign(User, userModelMock);

    const mockImage = {
      title: "Headphones",
      transformationType: "fill",
      publicId: "PixelPulse/uoybq2zt",
      secureURL: "https://res.cloudinary.com/dfjq7ok/Pixel",
      width: 50,
      height: 50,
      config: "",
      transformationURL: "https://res.cloudinary.com/dfjq7ok/Pixel",
      aspectRatio: "",
      prompt: "",
      color: "",
      author: "1",
    };

    const imageModelMock = {
      create: () => Promise.resolve(mockImage)
    };

    vi.mock('next/cache', async (importOriginal) => {
      return {
        ...await importOriginal<typeof import('next/cache')>(),
        // this will only affect "foo" outside of the original module
        revalidatePath: () => 'mocked'
      }
    })

    Object.assign(Image, imageModelMock);
    const path = "somePath";
    const userEmail = "hello@gmail.com";
    const image = {
      title: "Headphones",
      transformationType: "fill",
      publicId: "PixelPulse/uoybq2zt",
      secureURL: "https://res.cloudinary.com/dfjq7ok/Pixel",
      width: 50,
      height: 50,
      config: "",
      transformationURL: "https://res.cloudinary.com/dfjq7ok/Pixel",
      aspectRatio: "",
      prompt: "",
      color: "",
    };

    const output = await addImage({ image, userEmail, path });
    expect(output).toStrictEqual(mockImage);
  });
});

describe("testing addImage action", () => {

  it("deleteImage status should be 200", async () => {

    const connection = {
      connect: () => Promise.resolve(true)
    }

    Object.assign(mongoose, connection);

    const imageId = "1";

    const imageModelMock = {
      findByIdAndDelete: () => Promise.resolve(true)
    };

    Object.assign(Image, imageModelMock);


    vi.mock('next/navigation', async (importOriginal) => {
      return {
        ...await importOriginal<typeof import('next/navigation')>(),
        // this will only affect "foo" outside of the original module
        redirect: () => {return 'success'}
      }
    })
    await deleteImage(imageId);
  });
});