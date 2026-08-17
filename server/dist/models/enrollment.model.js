import mongoose, { Model, Schema } from "mongoose";
const enrollmentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", index: true },
    enrolledAt: {
        type: Date,
        default: Date.now()
    },
}, { timestamps: true });
export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
//# sourceMappingURL=enrollment.model.js.map