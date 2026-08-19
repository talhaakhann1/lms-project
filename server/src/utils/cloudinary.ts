import type { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadAtCloudinary = async (
  localPath: string,
  options?: {
    type?: "avatar" | "thumbnail" | "general";
  },
): Promise<UploadApiResponse | null> => {
  try {
    if (!localPath) return null;

    const type = options?.type ?? "general";

    const transformation =
      type === "avatar"
        ? [
            {
              width: 128,
              height: 128,
              crop: "fill",
              gravity: "face",
              quality: "auto",
              fetch_format: "auto",
            },
          ]
        : type === "thumbnail"
          ? [
              {
                width: 1200,
                height: 675,
                crop: "fill",
                quality: "auto",
                fetch_format: "auto",
              },
            ]
          : [
              {
                quality: "auto",
                fetch_format: "auto",
              },
            ];

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
      folder: "lms",
      transformation,
    });

    return response;
  } catch (error: unknown) {
    console.error("Cloudinary upload failed:", error);
    return null;
  } finally {
    try {
      await fs.unlink(localPath);
    } catch (error) {
      console.error("Failed to remove temporary file:", error);
    }
  }
};

export const deleteAtCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" = "image",
) => {
  try {
    if (!publicId) return null;

    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    return null;
  }
};