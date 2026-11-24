import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import type { TokenPayload } from "../types/global.js";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import { deleteAtCloudinary, uploadAtCloudinary } from "../utils/cloudinary.js";
import { UserStatus, UserRoles, LoginTypes } from "../types/user.enum.js";
import mongoose from "mongoose";
import fs from "fs/promises";

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
    const normalizedEmail = email.toLowerCase().trim();
    const existUser = await User.findOne({
      email: normalizedEmail,
    });
    if (existUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      provider: LoginTypes.LOCAL,
      password,
      role: UserRoles.STUDENT,
      status: UserStatus.ACTIVE,
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
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
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.provider !== "local") {
    throw new ApiError(400, `Please login using ${user.provider}`);
  }

  const isPasswordValid = await user.isPasswordValid(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  user.status = UserStatus.ACTIVE;
  await user.save({ validateBeforeSave: false });
  const [loggedInUser] = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        fullName: 1,
        email: 1,
        status: 1,
        role: 1,
        title: 1,
        bio: 1,
        avatar: 1,
      },
    },
  ]);
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const accessTokenMaxAge = 7 * 24 * 60 * 60 * 1000;
  const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    path: "/",
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

export const loginWithGoogle = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.body;

    if (!code) {
      throw new ApiError(400, "Code is required");
    }

    const tokenResponse = await fetch(process.env.GOOGLE_CODE_EXCHANGE_URI!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    console.log(tokenResponse);

    if (!tokenResponse.ok) {
      throw new ApiError(400, "Google token exchange failed");
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token || tokenData.error) {
      throw new ApiError(400, "Google authentication failed");
    }

    const userInfoResponse = await fetch(process.env.GOOGLE_USER_INFO_URI!, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    if (!userInfoResponse.ok) {
      throw new ApiError(400, "Failed to retrieve Google account");
    }

    const userInfo = await userInfoResponse.json();

    if (!userInfo.email || !userInfo.email_verified) {
      throw new ApiError(400, "Google account email is not verified");
    }

    const email = userInfo.email.toLowerCase().trim();
    const name = userInfo.name?.trim() || email.split("@")[0];
    const image = userInfo.picture || "";

    let user = await User.findOne({ email });

    if (user && user.provider !== "google") {
      if (user.provider === "github") {
        throw new ApiError(400, "Please login using GitHub");
      }

      throw new ApiError(
        400,
        "User with that email already exists. Please login using your existing method.",
      );
    }

    const accessTokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      path: "/",
    };

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        avatar: {
          url: image,
          publicId: "",
        },
        provider: "google",
        isVerified: true,
      });
    }

    user.fullName = name;
    user.avatar = {
      publicId: user.avatar?.publicId || "",
      url: image,
    };
    user.isVerified = true;

    await user.save();

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id,
    );

    const [loggedInUser] = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user._id),
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          fullName: 1,
          email: 1,
          status: 1,
          role: 1,
          title: 1,
          bio: 1,
          avatar: 1,
        },
      },
    ]);

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
  },
);

export const loginWithGithub = asyncHandler(
  async (req: Request, res: Response) => {
    const { code } = req.body;

    if (code == undefined) {
      throw new ApiError(400, "code is required");
    }

    const tokenResponse = await fetch(process.env.GITHUB_CODE_EXCHANGE_URI!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new ApiError(
        400,
        tokenData.error_description || "GitHub authentication failed",
      );
    }

    const githubToken = tokenData.access_token;


    const emailResponse = await fetch(process.env.GITHUB_EMAIL_URI!, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!emailResponse.ok) {
      throw new ApiError(400, "Failed to retrieve GitHub emails");
    }

    const emailData = await emailResponse.json();

    const primaryEmail = emailData.find(
      (email: { primary: boolean; verified: boolean }) =>
        email.primary && email.verified,
    );

    if (!primaryEmail?.email) {
      throw new ApiError(
        400,
        "GitHub account does not have a verified primary email",
      );
    }

    const email = primaryEmail.email.toLowerCase().trim();

    const userResponse = await fetch(process.env.GITHUB_USER_INFO_URI!, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!userResponse.ok) {
      throw new ApiError(400, "Failed to retrieve GitHub profile");
    }

    const userInfo = await userResponse.json();

    const name = userInfo.name?.trim() || userInfo.login;
    const image = userInfo.avatar_url || "";

    if (!userInfo.id || !userInfo.login) {
      throw new ApiError(400, "Invalid GitHub account information");
    }

    let user = await User.findOne({ email });

    if (user && user.provider !== "github") {
      if (user.provider === "google") {
        throw new ApiError(400, "Please login using Google");
      }

      throw new ApiError(
        400,
        "User with that email already exists. Please use your existing login method",
      );
    }

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        avatar: {
          public_id: "",
          url: image,
        },
        provider: "github",
        isVerified: true,
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id,
    );

    const accessTokenMaxAge = 7 * 24 * 60 * 60 * 1000;
    const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
      path: "/",
    };
    // 10. Update existing GitHub user
    user.fullName = name;
    user.avatar = {
      publicId: user.avatar?.publicId || "",
      url: image,
    };
    user.isVerified = true;

    await user.save();

    const [loggedInUser] = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(user._id),
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          fullName: 1,
          email: 1,
          status: 1,
          role: 1,
          title: 1,
          bio: 1,
          avatar: 1,
        },
      },
    ]);

    // 11. Generate application JWTs and send response
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
  },
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
        },
        $set: {
          status: UserStatus.INACTIVE,
        },
      },
      { new: true },
    );
  }

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const authHeader = req.header("Authorization");
    let bearerToken: string | undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      bearerToken = authHeader.substring(7).trim();
    }

    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken || bearerToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is missing");
    }
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        { algorithms: ["HS256"] },
      ) as TokenPayload;

      if (
        !decodedToken ||
        decodedToken.type !== "refresh" ||
        !decodedToken._id
      ) {
        throw new ApiError(401, "Invalid refresh token");
      }

      const user = await User.findById(decodedToken._id);

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      if (!user.refreshToken || incomingRefreshToken !== user.refreshToken) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError(
          401,
          "Refresh token has been revoked or already used",
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshToken(user._id);

      const isProduction = process.env.NODE_ENV === "production";

      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ("none" as const) : ("lax" as const),
        path: "/",
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", newRefreshToken, {
          ...cookieOptions,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed successfully",
          ),
        );
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  },
);

export const changeUserAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(400, "Avatar file is missing");
    }
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      if (req.file.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      throw new ApiError(
        400,
        "Only image files (JPEG, PNG, WebP, GIF) are allowed for avatar",
      );
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      if (req.file.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      throw new ApiError(404, "User not found");
    }

    const previousPublicId = user.avatar?.publicId;
    const avatarLocalPath = req.file.path;
    const avatar = await uploadAtCloudinary(avatarLocalPath, {
      type: "avatar",
    });
    if (!avatar) {
      throw new ApiError(500, "Error during uploading avatar to cloud storage");
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          avatar: {
            url: avatar.secure_url,
            publicId: avatar.public_id,
          },
        },
      },
      { new: true },
    ).select("-password -refreshToken");

    if (previousPublicId) {
      await deleteAtCloudinary(previousPublicId, "image").catch((err) => {
        console.error("Failed to delete previous avatar from cloud:", err);
      });
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
  },
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Simulate 10-second API response delay
    // await new Promise((resolve) => setTimeout(resolve, 10_000));

    if (!req.user || !req.user._id) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "User is not authenticated"));
    }

    const [user] = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          fullName: 1,
          email: 1,
          status: 1,
          role: 1,
          title: 1,
          bio: 1,
          avatar: 1,
        },
      },
    ]);

    if (!user) {
      return res.status(200).json(new ApiResponse(200, null, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Current user fetch successfully"));
  },
);

export const getUsers = asyncHandler(async (_, res: Response) => {
  const users = await User.aggregate([
    {
      $match: {
        role: {
          $in: ["student", "instructor"],
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        fullName: 1,
        email: 1,
        role: 1,
        status: 1,
        title: 1,
        bio: 1,
        avatar: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, users || [], "Successfuly fetch available user"),
    );
});
export const getAllInstructors = asyncHandler(async (_, res: Response) => {
  const users = await User.aggregate([
    {
      $match: {
        role: "instructor",
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        _id: 0,
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

export const assignRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;
  const { userId } = req.params;

  if (!role) {
    throw new ApiError(404, "role is required");
  }
  if (!userId) {
    throw new ApiError(400, "userid is required");
  }

  const roleExist = await User.findOne({
    _id: userId,
    role,
  });

  if (roleExist) {
    throw new ApiError(400, "User already has this role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role,
      },
    },
    { new: true },
  );
  if (!user) {
    throw new ApiError(400, "user does not exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully assign new role"));
});

export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, title, bio } = req.body;

    const userId = req.user._id;

    const existedUser = await User.findById(userId);

    if (!existedUser) {
      throw new ApiError(404, "User not found");
    }

    const updatedData: Record<string, unknown> = {};

    if (fullName) updatedData.fullName = fullName;
    if (title) updatedData.title = title;
    if (bio) updatedData.bio = bio;

    if (req.file) {
      const avatarLocalPath = req.file.path;

      if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar path not found");
      }
      const avatar = await uploadAtCloudinary(avatarLocalPath, {
        type: "avatar",
      });
      if (!avatar) {
        throw new ApiError(
          500,
          "Something went wrong while uploading the avatar.",
        );
      }
      if (existedUser.avatar) {
        await deleteAtCloudinary(existedUser.avatar.publicId, "image");
      }
      updatedData.avatar = {
        url: avatar.secure_url,
        publicId: avatar.public_id,
      };
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updatedData,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      throw new ApiError(500, "Something went wrong while updating the user");
    }
    const [user] = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          fullName: 1,
          email: 1,
          role: 1,
          title: 1,
          bio: 1,
          avatar: 1,
        },
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User profile details updated"));
  },
);
