import type { Request, Response } from "express";

//Admin only

import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import slugify from "slugify";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const existCategory = await Category.findOne({ name });
    if (existCategory) {
      throw new ApiError(403, "Category with this name already exist");
    }
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });
    const category = await Category.create({
      name,
      slug,
    });
    const response = {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
    };
    return res
      .status(201)
      .json(
        new ApiResponse(201, response, "Successfully created the category"),
      );
  },
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const { categoryId } = req.params;
    if (!categoryId) {
      throw new ApiError(400, "categoryId is required");
    }
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });
    const category = await Category.findOneAndUpdate(
      { _id: categoryId },
      {
        $set: {
          name,
          slug,
        },
      },
      { new: true },
    );
    if (!category) {
      throw new ApiError(404, "category does not exist");
    }
    const response = {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
    };
    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Successfully updated the category"),
      );
  },
);
