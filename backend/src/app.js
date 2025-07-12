import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config();

const app = express()

// CORS setup for dev and production
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = [
  "http://localhost:5173",
  "https://videotube-fullstack.vercel.app",
  process.env.CORS_ORIGIN
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

console.log("Allowed CORS Origins:", allowedOrigins);
console.log("CORS_ORIGIN from env:", process.env.CORS_ORIGIN);


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())




//routes import

import userRouter from './routes/user.routes.js'
import commentRouter from "./routes/comment.routes.js"
import videoRouter from "./routes/video.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"



//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


// https://localhost:8000/api/v1/users/regiser
// https://localhost:8000/api/v1/users/login


export {app}