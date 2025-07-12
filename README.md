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
<img width="1897" height="850" alt="image" src="https://github.com/user-attachments/assets/2146e345-3770-4e8b-ae45-a06b67a15ae6" />
<img width="1418" height="827" alt="image" src="https://github.com/user-attachments/assets/36a1ac1a-10f6-4d4f-b398-c7be615cd453" />
<img width="1887" height="864" alt="image" src="https://github.com/user-attachments/assets/d29fd7f9-3584-47ae-b55d-90992573f58a" />
<img width="1028" height="729" alt="Screenshot 2025-07-12 152406" src="https://github.com/user-attachments/assets/f029fde2-53b1-4db8-880f-f098a3fa2506" />
<img width="1898" height="908" alt="Screenshot 2025-07-11 140458" src="https://github.com/user-attachments/assets/6245c1b9-5a3a-4dc7-919f-18e8e3f9bde0" />
<img width="1890" height="916" alt="Screenshot 2025-07-11 140532" src="https://github.com/user-attachments/assets/ee51e8d5-290c-425a-9084-57b913f92463" />
<img width="1912" height="926" alt="Screenshot 2025-07-11 140623" src="https://github.com/user-attachments/assets/05890aad-d30e-45b9-988d-5c4b6600f8d6" />
<img width="1912" height="915" alt="Screenshot 2025-07-11 140808" src="https://github.com/user-attachments/assets/b50aff83-cc64-4990-918a-f1759d675410" />

<details>
<summary>📸 Screenshots (click to expand)</summary>

| Home Feed | Watch Page |
|-----------|------------|
| ![](https://github.com/user-attachments/assets/2146e345-3770-4e8b-ae45-a06b67a15ae6) | ![](https://github.com/user-attachments/assets/d29fd7f9-3584-47ae-b55d-90992573f58a) |

| Upload Video | Channel Page |
|--------------|--------------|
| ![](https://github.com/user-attachments/assets/f029fde2-53b1-4db8-880f-f098a3fa2506) | ![](https://github.com/user-attachments/assets/6245c1b9-5a3a-4dc7-919f-18e8e3f9bde0) |

| Profile (View Mode) | Profile (Edit Mode) |
|----------------------|---------------------|
| ![](https://github.com/user-attachments/assets/ee51e8d5-290c-425a-9084-57b913f92463) | ![](https://github.com/user-attachments/assets/05890aad-d30e-45b9-988d-5c4b6600f8d6) |

| Avatar + Cover Image Upload | Subscriptions / Channel View |
|------------------------------|------------------------------|
| ![](https://github.com/user-attachments/assets/b50aff83-cc64-4990-918a-f1759d675410) | ![](https://github.com/user-attachments/assets/36a1ac1a-10f6-4d4f-b398-c7be615cd453) |

</details>



