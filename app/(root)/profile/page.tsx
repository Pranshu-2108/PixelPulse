"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Image from "next/image";
import { Collection } from "@/components/Collection";
import { upload } from "@/lib/upload";

const ProfilePage = ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const router = useRouter();

  const logoutHandler = async (e: any) => {
    const response = await axios.get("/api/user/logout");
    router.push("/login");
  };

  const deleteHandler = async (e: any) => {
    const response = await axios.get("/api/user/delete");
    router.push("/login");
  };

  const UploadPhotoHandler = async (e: any) => {
    console.log(e.target.files);
    const file = e.target.files?.[0];
    console.log(user);
    const obj = {
      file,
      user,
    };
    await upload(obj, (link: any) => {
      setProfileImg(link);
      router.refresh();
    });
  };

  const [user, setUser] = useState({} as any);

  const [images, setImages] = useState([] as any);

  const [loading, setLoading] = useState(true);

  const [profileImg, setProfileImg] = useState(
    "/assets/images/profilePlaceholder.png"
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      let response = await axios.post("/api/user/images", page);
      setUser(response.data.user);
      setImages(response.data.images);
      let res = await axios.get("api/user/avatar");
      if (res.data) {
        setProfileImg(res.data);
      } else setProfileImg("/assets/images/profilePlaceholder.png");
      setLoading(false);
    };
    fetchData();
  }, []);

  return loading ? (
    <>
      <div className="flex h-full mx-auto">
        <Image
          src="/assets/icons/spinner.svg"
          width={50}
          height={50}
          alt="spinner"
          className="block my-auto mx-auto"
        />
        {/* <p className="text-white/80">Please wait...</p> */}
      </div>
    </>
  ) : (
    <>
      <Header title="Profile" subTitle="" />

      <div className="flex gap-10">
        <div className="h-full w-[50%]">
          <div className="profile h-full">
            <div className="profile-balance">
              <div className="flex">
                {/* <form action="/upload" method="post" encType="multipart/form-data">
                  <input className="mt-2 ml-3 border cursor-pointer border-gray-100 p-2 rounded-[50%] h-[200px] w-[210px] inline-block bg-[url('/assets/images/profilePlaceholder.png')] bg-cover" type="file" name="file" id="file">

                  </input>
                </form> */}
                <form
                  action="/upload"
                  method="post"
                  name="Profileform"
                  id="ProfileId"
                  encType="multipart/form-data"
                >
                  <label htmlFor="input-image" className="w-[200] h-[200]">
                    <div className="ml-4 rounded-full overflow-hidden aspect-square w-[200] h-[200] mt-2">
                      <Image
                        alt="profile-img"
                        src={profileImg}
                        width={200}
                        height={200}
                        className="object-cover cursor-pointer"
                      ></Image>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="input-image"
                    className="hidden"
                    onChange={UploadPhotoHandler}
                  ></input>
                </form>
                <div className="mx-auto mt-16">
                  <p className="text-xl font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-md mt-3">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  className="mx-3 mt-4 w-[50%] py-5 px-2"
                  onClick={logoutHandler}
                >
                  Logout
                </Button>
                <Button
                  className="mx-3 mt-4 w-[50%] py-5 px-2 hover:bg-red-600"
                  onClick={deleteHandler}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto w-[50%]">
          <section className="profile">
            <div className="profile-balance">
              <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src="/assets/icons/coins.svg"
                  alt="coins"
                  width={50}
                  height={50}
                  className="size-9 md:size-12"
                />
                <h2 className="h2-bold text-dark-600">{user?.creditBalance}</h2>
              </div>
            </div>

            <div className="profile-image-manipulation">
              <p className="p-14-medium md:p-16-medium">
                IMAGE MANIPULATION DONE
              </p>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src="/assets/icons/photo.svg"
                  alt="coins"
                  width={50}
                  height={50}
                  className="size-9 md:size-12"
                />
                <h2 className="h2-bold text-dark-600">
                  {images?.data?.length}
                </h2>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-8 md:mt-14">
        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default ProfilePage;
