import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

//  Public routes — visible to all users
router.get("/publishvideo", getAllVideos);
router.get("/:videoId", getVideoById);  // should be public

//  Protected routes — require login
router.use(verifyJWT);


// Publish or list videos
router
    .route("/publishvideo")
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

// Toggle publish/unpublish
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

// Get, update or delete video by ID
router
    .route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);


export default router