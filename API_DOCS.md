# SocialSphere API Documentation

This document outlines the API endpoints available in the SocialSphere application.

## Base URL
`http://localhost:8000`

## Authentication
Protected routes require a JWT access token.
- **Header:** `Authorization`
- **Value:** `Bearer {{accessToken}}`
- Refresh tokens are issued on signin and stored as an HttpOnly cookie `refreshToken` (used automatically by Postman).
- Global error responses are structured JSON:
  - `{ error, statusCode, path, method, timestamp, code?, bucket?, endpoint?, requestId? }`

## File Uploads & S3
- File uploads use Multer memory storage and AWS SDK v3 (S3Client).
- Limits: images must be 1MB or below; larger files return 413.
- Stored fields:
  - Posts: `imageUrl` (S3 URL), `imageKey` (S3 object key)
  - Users: `avatar` (S3 URL), `avatarKey` (S3 object key)
- On image replacement or post deletion, the previous S3 object is deleted.
- Required environment:
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (must match bucket), `AWS_S3_BUCKET`
  - Ensure `.env` is loaded (env.js calls `dotenv.config()`).
  - If the configured region is wrong, the service auto-detects the correct region on PermanentRedirect and retries.

## Endpoints

### 1. User Authentication & Management
**Base Path:** `/api/users`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | No | JSON: `{ "name": "...", "email": "...", "password": "...", "gender": "..." }` |
| `POST` | `/signin` | Log in user | No | JSON: `{ "email": "...", "password": "..." }` <br> Sets `refreshToken` cookie (HttpOnly), returns `{ accessToken, user }` |
| `POST` | `/refresh-token` | Refresh Access Token | No | Cookie: `refreshToken` (or JSON: `{ "refreshToken": "..." }`) returns `{ accessToken }` |
| `PUT` | `/update-details/:userId` | Update user profile | Yes | **FormData**: `avatar` (File), fields like `name`, `gender` etc. |
| `GET` | `/get-details/:userId` | Get user details by ID | Yes | Param: `userId` |
| `GET` | `/get-all-details` | Get all users | Yes | Query: `page`, `limit`, `search` (name/email), `sort`, `gender` |
| `POST` | `/logout` | Logout current session | Yes | JSON: `{ "refreshToken": "..." }` |
| `GET` | `/logout-all-devices` | Logout from all devices | Yes | - |

Responses (summary):
- Signup: 201 user object; 500 "Internal Server Error"
- Signin: 201 `{ accessToken, user }`; 404 "Email Invalid" or "Password Not Correct"; 500 error
- Refresh Token: 200 `{ accessToken }`; 401 "Access Denied. No refresh token provided." or "Invalid refresh token."; 400 "Invalid refresh token."
- Update Details: 201 updated user; 400 invalid userId; 404 "User id not found"; 413 "Image must be 1MB or below"; 500 error
- Get User Details: 201 user public fields; 404 "UserId Not Found"; 500 error
- Get All Users: 200 array of users; 500 error
- Logout: 200 "logout successful"; 400 "Refresh token is required for logout" or "User already logged out or token not found"; 500 error
- Logout All Devices: 400 "All Device logout successful" or "User already logged out"; 500 error

### 2. Posts
**Base Path:** `/api/posts`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/all` | Get all posts (feed) | Yes | Query: `page`, `limit`, `search` (caption), `sort` |
| `GET` | `/` | Get logged-in user's posts | Yes | - |
| `GET` | `/:postId` | Get a specific post | Yes | Param: `postId` |
| `POST` | `/` | Create a new post | Yes | **FormData**: `imageUrl` (File), `caption` (Text) |
| `PUT` | `/:postId` | Update a post | Yes | **FormData**: `imageUrl` (File - optional if supported), `caption` (Text) |
| `DELETE` | `/:postId` | Delete a post | Yes | Param: `postId` |

Responses (summary):
- Feed: 200 array of posts; 500 "server error! Try later!!"
- Get My Posts: 200 array; 404 "You Can not Create Any Post"; 500 error
- Get One: 200 post; 404 "Post Not Found"; 500 error
- Create: 201 post (imageUrl S3 URL, imageKey stored); 400 `{ message: "No file uploaded..." }`; 413 "Image must be 1MB or below"; 500 error
- Update: 200 "Post Updated" (if image provided, imageUrl S3 URL, imageKey updated and old image deleted); 404 "Post Not found"; 413 "Image must be 1MB or below"; 500 error
- Delete: 200 "Post Delete"; 404 "Not found Post"; 500 error
### 3. Comments
**Base Path:** `/api/comments`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/:postId` | Add a comment | Yes | JSON: `{ "content": "..." }` |
| `GET` | `/:postId` | Get comments for a post | Yes | Param: `postId`, Query: `page`, `limit` |
| `PUT` | `/:commentId` | Update a comment | Yes | JSON: `{ "content": "..." }` |
| `DELETE` | `/:commentId` | Delete a comment | Yes | Param: `commentId` |

Responses (summary):
- Add: 201 created comment; 500 error
- List: 200 array of comments; 500 error
- Update: 201 updated comment; 404 "Comment Not found"; 500 error
- Delete: 201 "Comment Deleted"; 404 "Not found Post"; 500 error
### 4. Likes
**Base Path:** `/api/likes`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/:id` | Get likes for an item | Yes | Param: `id` (Post/Comment ID) <br> Query: `type=Post|Comment` |
| `GET` | `/toggle/:id` | Toggle like | Yes | Param: `id` (Post/Comment ID) <br> Query: `type=Post|Comment` |

Notes:
- type is required and case-sensitive: use exactly `Post` or `Comment`.

Responses (summary):
- Get Likes: 201 array of like IDs; 404 "You send Wrong Id"; 500 error
- Toggle: 201 "Post Liked Succesfull" or "Post Unliked Succesfull" or "Comment Liked Succesfull" or "Comment Unliked Succesfull"; 500 error

### 5. Friendship
**Base Path:** `/api/friends`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/get-friends/:userId` | Get user's friends | Yes | Param: `userId`, Query: `page`, `limit` |
| `GET` | `/get-pending-requests` | Get pending requests | Yes | - |
| `GET` | `/toggle-friendship/:friendId` | Send/Remove friend request | Yes | Param: `friendId` |
| `GET` | `/response-to-request/:friendId` | Respond to request | Yes | Param: `friendId` |

Responses (summary):
- Get Friends: 200 array; 500 error
- Pending Requests: 200 array; 500 error
- Toggle Friendship: 201 object with request state; 500 error
- Respond To Request: 201 object with result; 500 error
### 6. OTP (Password Reset)
**Base Path:** `/api/otp`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/send` | Send OTP for password reset | Yes | JSON: `{ "email": "..." }` |
| `POST` | `/verify` | Verify OTP and reset password | Yes | JSON: `{ "email": "...", "otp": "...", "newPassword": "..." }` |

Responses (summary):
- Send: 201 "OTP sent successfully"; 404 "Please Send Corrected Email"; 500 error
- Verify: 201 result object; 404 "Please Send Corrected Email"; 500 error
### 7. Search
**Base Path:** `/api/search`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Global search (Users & Posts) | Yes | Query: `search` (required) |

Responses (summary):
- Global Search: 200 `{ users, posts }`; 400 "Search query is required"; 500 "Internal Server Error"
