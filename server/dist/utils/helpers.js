import fs from "fs/promises";
export const removeLocalFile = async (localPath) => {
    try {
        await fs.unlink(localPath);
        console.info("Removed local:", localPath);
    }
    catch (err) {
        console.error("Error while removing local file:", err);
    }
};
export const getStaticLocalPath = (req, fileName) => {
    return `${req.protocol}://${req.get("host")}/${fileName}`;
};
export const getLocalPath = (fileName) => {
    return `public/temp/${fileName}`;
};
//# sourceMappingURL=helpers.js.map