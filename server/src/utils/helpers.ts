import type { Request } from "express";
import fs from "fs/promises";

export const removeLocalFile = async (
  localPath: string
): Promise<void> => {
  try {
    await fs.unlink(localPath);
    console.info("Removed local:", localPath);
  } catch (err: unknown) {
    console.error("Error while removing local file:", err);
  }
};

export const getStaticLocalPath = (
  req: Request,
  fileName: string
): string => {
  return `${req.protocol}://${req.get("host")}/${fileName}`;
};

export const getLocalPath = (fileName: string): string => {
  return `public/temp/${fileName}`;
};