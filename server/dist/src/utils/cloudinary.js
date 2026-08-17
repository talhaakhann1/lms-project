import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
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
        console.log("reach");
        return response;
    }
    catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
    }
    finally {
        try {
            await fs.unlink(localPath);
        }
        catch {
            return null;
        }
    }
};
export const deleteAtCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId)
            return null;
        return await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
    }
    catch (error) {
        console.error("Cloudinary delete failed:", error);
        return null;
    }
};
//# sourceMappingURL=cloudinary.js.map