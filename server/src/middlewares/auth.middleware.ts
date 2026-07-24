import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import type { TokenPayload } from "../types/global.js";
import type { IUser } from "../interfaces/user.interface.js";
import mongoose from "mongoose";

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access token missing");
    }

    try {
      const decodedToken = jwt.verify(
        token._id,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as TokenPayload;

      if (!decodedToken) {
        throw new ApiError(400, "Invalid access token");
      }

      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken",
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }
      
      req.user = user as IUser;
      next();
    } catch (error: unknown) {
      throw new ApiError(401, "Invalid access token");
    }
  },
);

export const getLoggedInUserOrIgnore = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );
    req.user = user as IUser;
    next();
  } catch (error) {
    // Fail silently with req.user being falsy
    next();
  }
});

export const verifyRoles = (roles : string[]=[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized request");
    }
    if (roles.includes(req.user.role)) {
      next();
    } else {
      throw new ApiError(403, "You are not allowed to perform this action");
    }
  });
