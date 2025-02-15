"use client";
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export function UploadImage({
  onImageAdded,
  image,
}: {
  onImageAdded: (image: string) => void;
  image?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setUploading(true);
    try {
      const file = e.target.files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }

      // Fetch the presigned URL and fields from the backend
      const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      console.log("Backend response:", response.data); // Log the backend response

      const { presignedUrl, fields } = response.data;
      if (!presignedUrl || !fields) {
        throw new Error("Presigned URL or fields are missing in the response");
      }

      // Construct the FormData
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string); // Use append instead of set
      });
      formData.append("file", file); // Append the file

      console.log("FormData:", [...formData.entries()]); // Log FormData entries

      // Upload the file to S3 using the presigned URL
      const awsResponse = await axios.post(presignedUrl, formData);
      console.log("AWS response:", awsResponse.data); // Log the AWS response

      // Notify the parent component that the image has been added
      onImageAdded(`${CLOUDFRONT_URL}/${fields.key}`);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  }

  if (image) {
    return (
      <Image
        className={"p-2 rounded"}
        width={300}
        height={100}
        src={image}
        alt="image.jpg"
      />
    );
  }

  return (
    <div>
      <div className="w-40 h-40 rounded border text-2xl cursor-pointer">
        <div className="h-full flex justify-center flex-col relative w-full">
          <div className="h-full flex justify-center w-full pt-16 text-4xl">
            {uploading ? (
              <div className="text-sm">Loading...</div>
            ) : (
              <>
                +
                <input
                  className="w-full h-full bg-red-400 "
                  type="file"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  onChange={onFileSelect}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
