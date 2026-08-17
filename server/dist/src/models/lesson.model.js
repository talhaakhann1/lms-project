import mongoose, { Model, Schema } from "mongoose";
const lessonSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        unique: true,
        required: true,
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    video: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
    isPublished: {
        type: Boolean,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
export const Lesson = mongoose.model("Lesson", lessonSchema);
//# sourceMappingURL=lesson.model.js.map