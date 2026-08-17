import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { ZodNull } from "zod/v3";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadAtCloudinary = async (localPath) => {
    try {
        if (!localPath)
            return null;
        console.log(localPath);
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto",
            folder: "lms",
        });
        console.log("response", response);
        await fs.unlink(localPath);
        console.log("reach");
        return response;
    }
    catch (error) {
        await fs.unlink(localPath);
        return null;
    }
};
export const deleteAtCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId)
            return null;
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
        return response;
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=cloudinary.js.map