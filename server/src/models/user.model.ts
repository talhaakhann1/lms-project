import mongoose, { Model, Schema } from "mongoose";
import type { IUser } from "../interfaces/user.interface.js";
import { UserRoles } from "../types/user.enum.js";
import bcrypt from "bcrypt"
import jwt, { type SignOptions } from "jsonwebtoken";

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      index: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },
    isVerified:{
      type:Boolean,
      default:false
    },
    avatar: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String
      },
      default: {
        url: `https://via.placeholder.com/200x200.png`,
      },
    },
    role: {
      type: String,
      enum: UserRoles,
      default: UserRoles.STUDENT,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save",async function(){
  if(!this.isModified("password")) return ;
  this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordValid=async function(password:string){
  return await bcrypt.compare(this.password,password)
}

userSchema.methods.generateAccessToken=function(){
   const expiresIn = ( process.env.ACCESS_TOKEN_EXPIRY || "1d") as NonNullable<SignOptions["expiresIn"]>;
    return jwt.sign(
       {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET as string ,
    {
      expiresIn
    }
    )
}

userSchema.methods.generateRefreshToken=function(){
   const expiresIn = (process.env.REFRESH_TOKEN_EXPIRY || "1d") as NonNullable<SignOptions["expiresIn"]>;
  return jwt.sign(
       {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET as string ,
    {
      expiresIn
    }
    )
}

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
