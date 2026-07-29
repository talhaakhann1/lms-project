import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import type { TokenPayload } from "../types/global.js";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import { deleteAtCloudinary, uploadAtCloudinary } from "../utils/cloudinary.js";
import { UserRoles } from "../types/user.enum.js";

const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User does not exist");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken!;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
    );
  }
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;
    const existUser = await User.findOne({
      email,
    });
    if (existUser) {
      throw new ApiError(400, "User with this email already exist");
    }
    const user = await User.create({
      fullName,
      email,
      password,
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user",
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(201, createdUser, "User registered successfully"));
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordValid(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const accessTokenMaxAge = 7 * 24 * 60 * 60 * 1000;
  const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

  const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, 
};

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: accessTokenMaxAge,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenMaxAge,
    })
    .json(new ApiResponse(200, loggedInUser, "Successfully loggedIn user"));
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user._id;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logout"));
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Invalid access token");
    }
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as TokenPayload;

      const user = await User.findById(decodedToken._id);

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id,
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {}, "Access Token Refreshed"));
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  },
);

export const changeUserAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, "Avatar file is missing");
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const avatarLocalPath = req.file.path;
    const avatar = await uploadAtCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Error during uploading avatar on cloudinary");
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          avatar: {
            url: avatar.secure_url,
            publicId:avatar.public_id
          },
        },
      },
      { new: true },
    ).select("-password -refreshToken");

    let deletedAvatar = null;
    
    if (updatedUser?.avatar.publicId) {
      deletedAvatar = await deleteAtCloudinary(updatedUser?.avatar.publicId);
    }
    
    if (!deletedAvatar) {
      throw new ApiError(400, "Error during deleting avatar on cloudinary");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
  },
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "Current user fetch successfully"));
  },
);

export const getAvailableUsers = asyncHandler(async (_, res: Response) => {
  const users = await User.aggregate([
    {
      $match: {},
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        _id:0,
        id: { $toString: "$_id" },
        fullName: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, users || [], "Successfuly fetch available user"),
    );
});

export const assignInstructorRole=asyncHandler(async(req: Request, res: Response)=>{
    const {userId}=req.params;
    if(!userId){
        throw new ApiError(400,"userid is required");
    }
    const user=await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                role:UserRoles.INSTRUCTOR
            }
        },
        {new:true}
    )
    if(!user){
        throw new ApiError(400,"user does not exist")
    }
    return res.status(200).json(
        new ApiResponse(200,{},"Successfully assign user role instructor")
    )
})