import mongoose, { Model, Schema } from "mongoose";
const courseSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tagline: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true
    },
    thumbnail: {
        url: {
            type: String,
            default: `https://via.placeholder.com/200x200.png`
        },
        publicId: {
            type: String,
            default: ""
        }
    },
    learningOutcomes: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    instructor: { type: Schema.Types.ObjectId, ref: "User" },
    category: {
        type: String,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
export const Course = mongoose.model("Course", courseSchema);
//# sourceMappingURL=course.model.js.map