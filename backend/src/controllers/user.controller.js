import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    //get users detailes from frontend/or from postman...and what are the details we take from user we had already created on model
    //validation - not empty
    // check if user already exists: check from username, email
    // check files like :check for images, check for avatar
    // upload them to cloudinary, check avatar upload hua ki nai
    // cloudinary se image wapas agai ha merepas
    // create user object- bcz when we send data to mongodb its nosql..therefore we make objecct//: create entry in db
    // remove password and refresh token field from response: jo chize user ko dunga unmese ye hata dia
    // check for user creation- null response aya ha ki sachme user create ho gaya ha
    // return res or error 
    console.log("====== MULTER FILES ======");
    console.log("req.files:", req.files);
    console.log("====== BODY ======");
    console.log("req.body:", req.body);


    const {fullName, email, username, password} = req.body
    console.log("email", email);
    
    if(
        [fullName, email, username, password].some((field) => 
        field?.trim()==="")
    ){
        throw new ApiError(400, "All fields are required")
    }
    const existedUser= await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with email or user name already exist");
    }

    //like express give use req.body ... routes ke andar jake middleware add kia ha jo hume access deta ha file ke lia  
    //and multer req ke andar aur access deta ha jese- (req.files?)

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
       throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar || !avatar.url) {
       throw new ApiError(400, "Avatar upload failed");
    }


    //for coverImage uplod: we checked here- request file had came or not, properly array has camed or not,if its array have then it should have length
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   

    //now entry on data base
    const user= await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})


const loginUser = asyncHandler(async(req, res) => {
    //todos: username, email, password
    //req body -> se data le ao
    //username or email
    //find the user
    //password check
    //access and refresh token generate & send to user
    //send those datas in cookies form

    const {email, username, password} = req.body
    console.log(email);

    if(!(username || email)){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }


    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    // Dynamic cookie options for dev/prod
    const isProduction = process.env.NODE_ENV === "production";
    const cookieDomain = isProduction ? process.env.COOKIE_DOMAIN || ".yourdomain.com" : "localhost";
    const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      domain: cookieDomain
    };

    console.log(" Set-Cookie sent with accessToken:", accessToken);
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})


const logoutUser = asyncHandler(async(req, res) => {
    //cookies clear: bcz ye server se hi manage ho sakti ha http only
    //remove refresh token also from model: reset of refresh token

    User.findByIdAndUpdate(
     await req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        domain: "localhost"
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user loged out successfully"))

})


const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unothorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "invalid reresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            domain: "localhost"
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newrefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword, confPassword} = req.body

    if(!(newPassword === confPassword)){
        throw new ApiError(401, "newpassword and confpassword are not matching")
    }
    
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password saved successfully"))

})


//agar user logedin ha toh usko me 2 minute me currentuser desakta hun: bcz middleware me humne already pur user ko req.user me dhal dia ha
const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})


const updateAccountDetails = asyncHandler(async(req, res) => {
    const{fullName, email} = req.body

    if(!fullName || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})


const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is mossing")
    }

    //todo: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set: {
                avatar: avatar.url   // not an object, just the URL string
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "avatar updated successfully")
    )
})


const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverLocalPath = req.file?.path

    if(!coverLocalPath){
        throw new ApiError(400, "cover file is mossing")
    }

    const coverImage = await uploadOnCloudinary(coverLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "coverImage updated successfully")
    )
})


const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed : false             
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(400, "channel does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "user channel fetched successfully")
    )
})


const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory"
            }
        },
        {
            $unwind: "$watchHistory"
        },
        {
            $lookup: {
                from: "users",
                localField: "watchHistory.owner",
                foreignField: "_id",
                as: "watchHistory.ownerDetails"
            }
        },
        {
            $addFields: {
                "watchHistory.owner": {
                    $first: "$watchHistory.ownerDetails"
                }
            }
        },
        {
            $project: {
                "watchHistory.ownerDetails": 0
            }
        },
        {
            $group: {
                _id: null,
                watchHistory: {
                    $push: "$watchHistory"
                }
            }
        }
    ]) 

    console.log("Watch history aggregation result:", user);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0]?.watchHistory || [],
            "watch history fetched successfully"
        )
    )
})


const addToWatchHistory = asyncHandler(async(req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Add video to user's watch history
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { watchHistory: videoId } // $addToSet prevents duplicates
        },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Video added to watch history")
    );
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    addToWatchHistory,
}