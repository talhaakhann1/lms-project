import multer from "multer";
import path from "path";
import fs from "fs";
const uploadDir = "./public/temp";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});
export const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
    },
    fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = [
            // Images
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            // Videos
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-matroska",
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image and video files are allowed."));
        }
    },
});
//# sourceMappingURL=multer.middleware.js.map