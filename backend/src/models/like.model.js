import mongoose, { Schema } from "mongoose";


const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref:"Video"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref:"Comment"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref:"Tweet"
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref:"User"
        },
    },
    {
        timestamps: true
    }
)

// Add compound index to prevent duplicate likes
likeSchema.index({ video: 1, likedBy: 1 }, { unique: true, sparse: true });
likeSchema.index({ comment: 1, likedBy: 1 }, { unique: true, sparse: true });
likeSchema.index({ tweet: 1, likedBy: 1 }, { unique: true, sparse: true });


export const Like = mongoose.model("Like", likeSchema)