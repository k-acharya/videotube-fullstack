import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    console.log("Toggle like - Video ID:", videoId, "User ID:", req.user._id);

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    console.log("Existing like found:", existingLike);

    if (existingLike) {
        console.log("Deleting existing like:", existingLike._id);
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, {}, "Video unliked"));
    }

    console.log("Creating new like");
    try {
        const like = await Like.create({
            video: videoId,
            likedBy: req.user._id
        });

        console.log("New like created:", like);

        return res
        .status(201)
        .json(new ApiResponse(201, like, "Video liked"));
    } catch (error) {
        // Handle duplicate key error (race condition)
        if (error.code === 11000) {
            console.log("Duplicate like detected, treating as already liked");
            return res.status(200).json(new ApiResponse(200, {}, "Video already liked"));
        }
        throw error;
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, {}, "Comment unliked"));
    }

    const like = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    });

    return res
    .status(201)
    .json(new ApiResponse(201, like, "Comment liked"));
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, {}, "Tweet unliked"));
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    });

    return res
    .status(201)
    .json(new ApiResponse(201, like, "Tweet liked"));
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likes = await Like.find({ likedBy: req.user._id, video: { $exists: true } })
        .populate("video");

    const likedVideos = likes.map((like) => like.video);

    return res
    .status(200).json( new ApiResponse(200, likedVideos, "Liked videos fetched"))  
})

const cleanupDuplicateLikes = asyncHandler(async (req, res) => {
    // This is a temporary function to clean up duplicate likes
    console.log("Cleaning up duplicate likes...");
    
    // First, clean up likes without likedBy field (orphaned likes)
    const orphanedLikes = await Like.find({ likedBy: { $exists: false } });
    console.log(`Found ${orphanedLikes.length} orphaned likes (missing likedBy field)`);
    
    if (orphanedLikes.length > 0) {
        await Like.deleteMany({ likedBy: { $exists: false } });
        console.log(`Deleted ${orphanedLikes.length} orphaned likes`);
    }
    
    // Then clean up duplicate likes with the same video and likedBy
    const duplicates = await Like.aggregate([
        {
            $group: {
                _id: { video: "$video", likedBy: "$likedBy" },
                count: { $sum: 1 },
                docs: { $push: "$_id" }
            }
        },
        {
            $match: {
                count: { $gt: 1 }
            }
        }
    ]);

    console.log("Found duplicate groups:", duplicates);

    let totalDeleted = orphanedLikes.length;
    for (const group of duplicates) {
        // Keep the first like, delete the rest
        const likesToDelete = group.docs.slice(1);
        await Like.deleteMany({ _id: { $in: likesToDelete } });
        console.log(`Deleted ${likesToDelete.length} duplicate likes for video ${group._id.video}`);
        totalDeleted += likesToDelete.length;
    }

    return res.status(200).json(new ApiResponse(200, { 
        orphanedLikesDeleted: orphanedLikes.length,
        duplicateLikesDeleted: totalDeleted - orphanedLikes.length,
        totalDeleted 
    }, "Duplicate and orphaned likes cleaned up"));
});

const getLikesStatus = asyncHandler(async (req, res) => {
    // This is a temporary function to check the status of likes in the database
    console.log("Checking likes status...");
    
    const totalLikes = await Like.countDocuments();
    const orphanedLikes = await Like.countDocuments({ likedBy: { $exists: false } });
    
    const likesByVideo = await Like.aggregate([
        {
            $group: {
                _id: "$video",
                count: { $sum: 1 },
                likes: { $push: "$$ROOT" }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, {
        totalLikes,
        orphanedLikes,
        likesByVideo: likesByVideo.map(item => ({
            videoId: item._id,
            count: item.count,
            hasOrphaned: item.likes.some(like => !like.likedBy)
        }))
    }, "Likes status retrieved"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    cleanupDuplicateLikes,
    getLikesStatus
}