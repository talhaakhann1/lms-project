import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import { Lesson } from "../models/lesson.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { UserRoles } from "../types/user.enum.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "Access token missing");
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError(400, "Invalid access token");
        }
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    }
    catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
});
export const getLoggedInUserOrIgnore = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
        req.user = user;
        next();
    }
    catch (error) {
        // Fail silently with req.user being falsy
        next();
    }
});
export const verifyRoles = (roles = []) => asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }
    if (roles.includes(req.user.role)) {
        next();
    }
    else {
        throw new ApiError(403, "You are not allowed to perform this action");
    }
});
export const verifyEnrollment = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }
    if (req.user.role == UserRoles.ADMIN) {
        next();
    }
    let courseId = req.params.courseId;
    if (!courseId) {
        const lesson = await Lesson.findById(req.params.lessonId);
        if (!lesson) {
            throw new ApiError(404, "Lesson not found");
        }
        courseId = lesson.course.toString();
    }
    const userId = req.user._id;
    const enrollment = await Enrollment.findOne({
        course: courseId,
        user: userId,
    });
    if (!enrollment) {
        throw new ApiError(403, "Access Denied");
    }
    next();
});
//# sourceMappingURL=auth.middleware.js.map