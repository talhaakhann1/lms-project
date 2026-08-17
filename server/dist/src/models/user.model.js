import mongoose, { Model, Schema } from "mongoose";
import { UserRoles, UserStatus } from "../types/user.enum.js";
import bcrypt from "bcrypt";
import jwt, {} from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new Schema({
    fullName: {
        type: String,
        index: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true,
        trim: true,
    },
    title: {
        type: String,
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerificationExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    avatar: {
        url: {
            type: String,
            default: `https://via.placeholder.com/200x200.png`,
            required: true,
        },
        publicId: {
            type: String,
            default: ""
        },
    },
    role: {
        type: String,
        enum: UserRoles,
        default: UserRoles.STUDENT,
    },
    status: {
        type: String,
        enum: UserStatus,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    const expiresIn = (process.env.ACCESS_TOKEN_EXPIRY || "1d");
    return jwt.sign({
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn
    });
};
userSchema.methods.generateRefreshToken = function () {
    const expiresIn = (process.env.REFRESH_TOKEN_EXPIRY || "1d");
    return jwt.sign({
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn
    });
};
userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    const tokenExpiry = Date.now() + 15 * 60 * 1000;
    return { unHashedToken, hashedToken, tokenExpiry };
};
export const User = mongoose.model("User", userSchema);
//# sourceMappingURL=user.model.js.map