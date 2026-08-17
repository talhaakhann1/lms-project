import type { UploadApiResponse } from "cloudinary";
export declare const uploadAtCloudinary: (localPath: string) => Promise<UploadApiResponse | null>;
export declare const deleteAtCloudinary: (publicId: string, resourceType?: "image" | "video") => Promise<any>;
//# sourceMappingURL=cloudinary.d.ts.map