import mongoose, { Model, Schema } from "mongoose";
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
}, { timestamps: true });
reviewSchema.index({
    course: 1,
});
reviewSchema.index({
    user: 1,
    course: 1,
}, {
    unique: true,
});
export const Review = mongoose.model("Review", reviewSchema);
//# sourceMappingURL=review.model.js.map