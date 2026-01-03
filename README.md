# SocialSphere API

SocialSphere is a robust Social Media REST API built with Node.js, Express.js, and MongoDB. It provides a complete backend solution for a social networking platform, featuring secure authentication, post management, social interactions (likes, comments, friends), and advanced query capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure Signup/Signin with JWT (Access & Refresh Tokens), Logout, and Logout All Devices.
- **Security**: 
  - Dual-token authentication system (Short-lived Access Token, Long-lived Refresh Token).
  - Password hashing.
  - OTP-based password reset.
- **User Profile**: Update details, upload avatar images.
  - Stored fields: `avatar` (S3 URL) and `avatarKey` (S3 object key)
  - Old avatars are deleted on update
- **Posts**: Create, Read, Update, Delete posts with image uploads.
  - Stored fields: `imageUrl` (S3 URL) and `imageKey` (S3 object key)
  - Old images are deleted on update or post delete
- **Social Interactions**: 
  - **Comments**: Add, update, delete comments on posts.
  - **Likes**: Toggle likes on posts.
  - **Friendship**: Send requests, accept/reject, view friends and pending requests.

### Advanced Features
- **Global Search**: Search across Users and Posts simultaneously.
- **Advanced Querying**: 
  - **Pagination**: Efficiently load large datasets.
  - **Filtering**: Filter users by specific attributes (e.g., gender).
  - **Sorting**: Sort results by various fields.
  - **Search**: Targeted search within specific resources (Users, Posts).

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **File Handling**: Multer (memory storage) + AWS S3 (AWS SDK v3)
- **Email Service**: Nodemailer (for OTPs)
- **Logging**: Winston / Custom Logger

## 📂 Project Structure
The project follows a feature-based modular architecture:

```
src/
├── config/         # Database and app configuration
├── features/       # Feature-based modules
│   ├── user/       # User controller, repository, routes, schema
│   ├── post/       # Post controller, repository, routes, schema
│   ├── comment/    # Comment controller, repository, routes, schema
│   ├── like/       # Like controller, repository, routes, schema
│   ├── friendship/ # Friendship controller, repository, routes, schema
│   ├── otp/        # OTP controller, repository, routes, schema
│   └── search/     # Global search functionality
├── middleware/     # Custom middlewares (JWT, Logger, FileUpload)
└── error/          # Error handling classes
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Supriya9002/SocialSphere
   cd SocialSphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   For S3 uploads (AWS SDK v3 is already listed in package.json):
   ```bash
   npm install @aws-sdk/client-s3
   ```

3. **Configure Environment Variables:**
   - The project uses `env.js` with `dotenv`. Ensure:
     - Database: `DB_URL`
     - JWT: `Access_Token_JWT_SECRET`, `Refresh_Token_JWT_SECRET`, `Access_Token_ExpiresIn`, `Refresh_Token_ExpiresIn`
     - Email (for OTP): provider credentials
     - AWS S3 (for uploads): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`
       - `AWS_REGION` must match the bucket’s region (e.g., `eu-north-1` for `cmslr`)
       - Images are limited to 1MB to improve performance
   - Do not commit secrets; keep them only in `.env` or a secrets manager.

4. **Start the server:**
   ```bash
   npm run dev  # For development with Nodemailer
   # OR
   npm start    # Production start
   ```

## 📚 API Documentation

For detailed API documentation, please refer to:
- **[API_DOCS.md](./API_DOCS.md)**: Comprehensive guide to all endpoints, parameters, and responses.
- **[SocialSphere.postman_collection.json](./SocialSphere.postman_collection.json)**: Import this file into Postman for a pre-configured testing environment.
  - Signin sets `refreshToken` as a cookie; Postman carries cookies automatically. Use `/refresh-token` without a body to refresh the access token.

### Quick Endpoint Overview

| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/api/users/signup` | Register new user |
| | POST | `/api/users/signin` | Login (Returns Access & Refresh Tokens) |
| | POST | `/api/users/refresh-token` | Refresh expired Access Token |
| | POST | `/api/users/logout` | Logout (Revokes Refresh Token) |
| **Users** | PUT | `/api/users/update-details/:userId` | Update user details (avatar stored on S3) |
| **Search** | GET | `/api/search?search=query` | Global search (Users & Posts) |
| **Users** | GET | `/api/users/get-all-details` | Get users (Supports search, filter, sort, page) |
| **Posts** | GET | `/api/posts/all` | Get posts (Supports search, sort, page) |
| **Posts** | POST | `/api/posts` | Create post (image stored on S3) |

## 🧪 Testing

This project includes a Postman Collection file `SocialSphere.postman_collection.json`. 
1. Open Postman.
2. Click **Import**.
3. Select the `SocialSphere.postman_collection.json` file from the project root.
4. The collection is pre-configured with variables. Ensure you set the `baseUrl` variable (default: `http://localhost:8000`).
5. The `Signin` request automatically saves the `accessToken`. The refresh token is stored as an HttpOnly cookie and used automatically by Postman for `/refresh-token`.

## 📄 License
This project is licensed under the ISC License.

## 👤 Author
**Supriya Haldar**
- GitHub: [Supriya9002](https://github.com/Supriya9002)
