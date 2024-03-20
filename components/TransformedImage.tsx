"use client"

import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";

const TransformedImage = ({
  image,
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false,
}: TransformedImageProps) => {
  return (
    <div className="mb-4 ps-4">
      <h3 className="text-xl font-bold text-gray-200 my-4">Transformed</h3>
      {image?.publicId ? (
        <>
          <div className="cursor-pointer overflow-hidden rounded-[10px]">
            <CldImage
              width={getImageSize(type, image, "width")}
              height={getImageSize(type, image, "height")}
              src={image?.publicId}
              alt="image"
              sizes={"(max-width: 767px) 100vw, 50vw"}
              placeholder={dataUrl as PlaceholderValue}
              className="media-uploader_cldImage"
              onLoad={() => {
                setIsTransforming && setIsTransforming(false);
              }}
              onError={() => {
                debounce(() => {
                  setIsTransforming && setIsTransforming(false);
                }, 8000)();
              }}
              {...transformationConfig}
            />
          </div>
        </>
      ) : (
        <div className="media-uploader_cta">
          Transformed Image
          {/* {isTransforming && (
              <div className="transforming-loader">
                <Image
                  src="/assets/icons/spinner.svg"
                  width={50}
                  height={50}
                  alt="spinner"
                />
                <p className="text-white/80">Please wait...</p>
              </div>
            )} */}
        </div>
        
      )}
    </div>
  );
};

export default TransformedImage;
