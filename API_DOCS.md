# SocialSphere API Documentation

This document outlines the API endpoints available in the SocialSphere application.

## Base URL
`http://localhost:8000`

## Authentication
Protected routes require a JWT token.
- **Header:** `Authorization`
- **Value:** `<your_token_here>`

## Endpoints

### 1. User Authentication & Management
**Base Path:** `/api/users`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user | No | JSON: `{ "name": "...", "email": "...", "password": "...", "gender": "..." }` |
| `POST` | `/signin` | Log in user | No | JSON: `{ "email": "...", "password": "..." }` <br> **Response**: `{ "accessToken": "..." }` <br> **Cookie**: `refreshToken` (HttpOnly) |
| `POST` | `/refresh-token` | Refresh Access Token | No | **Cookie**: `refreshToken` (or JSON body) <br> **Response**: `{ "accessToken": "..." }` |
| `PUT` | `/update-details/:userId` | Update user profile | Yes | **FormData**: `avatar` (File), fields like `name`, `gender` etc. |
| `GET` | `/get-details/:userId` | Get user details by ID | Yes | Param: `userId` |
| `GET` | `/get-all-details` | Get all users | Yes | Query: `page`, `limit`, `search` (name/email), `sort`, `gender` |
| `POST` | `/logout` | Logout current session | Yes | JSON: `{ "refreshToken": "..." }` |
| `GET` | `/logout-all-devices` | Logout from all devices | Yes | - |

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

### 3. Comments
**Base Path:** `/api/comments`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/:postId` | Add a comment | Yes | JSON: `{ "content": "..." }` |
| `GET` | `/:postId` | Get comments for a post | Yes | Param: `postId`, Query: `page`, `limit` |
| `PUT` | `/:commentId` | Update a comment | Yes | JSON: `{ "content": "..." }` |
| `DELETE` | `/:commentId` | Delete a comment | Yes | Param: `commentId` |

### 4. Likes
**Base Path:** `/api/likes`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/:id` | Get likes for an item | Yes | Param: `id` (Post/Comment ID) |
| `GET` | `/toggle/:id` | Toggle like | Yes | Param: `id` (Post/Comment ID) |

### 5. Friendship
**Base Path:** `/api/friends`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/get-friends/:userId` | Get user's friends | Yes | Param: `userId`, Query: `page`, `limit` |
| `GET` | `/get-pending-requests` | Get pending requests | Yes | - |
| `GET` | `/toggle-friendship/:friendId` | Send/Remove friend request | Yes | Param: `friendId` |
| `GET` | `/response-to-request/:friendId` | Respond to request | Yes | Param: `friendId` |

### 6. OTP (Password Reset)
**Base Path:** `/api/otp`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/send` | Send OTP for password reset | Yes | JSON: `{ "email": "..." }` |
| `POST` | `/verify` | Verify OTP and reset password | Yes | JSON: `{ "email": "...", "otp": "...", "newPassword": "..." }` |

### 7. Search
**Base Path:** `/api/search`

| Method | Endpoint | Description | Auth Required | Request Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Global search (Users & Posts) | Yes | Query: `search` (required) |
