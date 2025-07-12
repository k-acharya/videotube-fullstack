#  VideoTube — Full Stack Video Sharing Platform

**VideoTube** is a full-stack video-sharing web application built using the MERN stack. It allows users to upload and watch videos, like and comment on them, and explore public channels — all through a responsive and modern UI. It supports secure authentication and media upload via Cloudinary.

---

##  Live Demo

 * [Frontend on Vercel](https://videotube-fullstack.vercel.app)

> The backend is hosted separately and accessed through Axios calls inside the frontend.

---

##  What’s Included

This project showcases what I’ve learned in full-stack development — from secure user auth to file uploads and frontend integration. Here's what’s **fully working end-to-end**:

###  Core Functionality (Fully Integrated in UI)

- **Authentication**
  - Register and login using access + refresh tokens
  - Tokens stored in cookies with automatic refresh handling
  - Upload avatar and cover image (Cloudinary)

- **Video Upload + View**
  - Upload videos with thumbnails
  - View videos on a public feed (dashboard/homepage)
  - Watch individual videos on a dedicated video page

- **Likes +  Comments**
  - Like/unlike videos (only after login)
  - Add comments to videos (only after login)
  - View comments on video pages

- **Channel View**
  - View other users' profiles and uploaded videos
  - Subscribe/unsubscribe to users (shows count)

- **Watch History**
  - Tracks and displays videos you've recently watched (for logged-in users)

---

## !! Not Yet Integrated in UI

These features exist in the backend, but haven’t been connected in the frontend yet:

-  Playlist creation and management  
-  Video deletion or editing  
-  Tweet/post feature  
-  Admin or moderation features

These may be added in the next versions of the project.

---

##  Tech Stack

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (access + refresh tokens)
- Cloudinary (video + image uploads)
- Multer for handling uploads
- bcrypt, cookie-parser, cors

### Frontend:
- React (with Vite)
- Tailwind CSS for styling
- Axios for HTTP requests
- React Router for routing
- Redux Toolkit for auth state management

---

##  Folder Structure
videotube-fullstack/
── backend/ Express + MongoDB API
── frontend/ React + Tailwind UI
---
## ScreenShots

<p align="center">
  <img src="https://github.com/user-attachments/assets/2146e345-3770-4e8b-ae45-a06b67a15ae6" width="420" />
  <img width="420" alt="Screenshot 2025-07-12 151838" src="https://github.com/user-attachments/assets/98d6474b-478a-4af9-94cb-ca7ceddf156c" />


</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/d29fd7f9-3584-47ae-b55d-90992573f58a" width="420" />
  <img width="420" src="https://github.com/user-attachments/assets/e0573f24-8139-4e09-b964-a1eb7aba5dd0" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6245c1b9-5a3a-4dc7-919f-18e8e3f9bde0" width="420" />
  <img src="https://github.com/user-attachments/assets/ee51e8d5-290c-425a-9084-57b913f92463" width="420" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/05890aad-d30e-45b9-988d-5c4b6600f8d6" width="420" />
  <img src="https://github.com/user-attachments/assets/b50aff83-cc64-4990-918a-f1759d675410" width="420" />
</p>



