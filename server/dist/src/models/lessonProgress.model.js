import mongoose, { Model, Schema } from "mongoose";
const lessonProgressSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", index: true },
    totalLessons: {
        type: Number,
        required: true,
        min: 0,
    },
    completedLessons: {
        type: Number,
        default: 0,
        min: 0,
    },
    completedLessonIds: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Lesson",
            },
        ],
        default: [],
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    enrolledAt: {
        type: Date,
    },
    completeAt: {
        type: Date,
    },
}, { timestamps: true });
lessonProgressSchema.index({
    user: 1,
    course: 1,
}, {
    unique: true,
});
export const LessonProgress = mongoose.model("LessonProgress", lessonProgressSchema);
//# sourceMappingURL=lessonProgress.model.js.map