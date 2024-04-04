# SocialSphere
This project is a robust SocialSphere developed using Node.js, Express.js, and MongoDB. It empowers users to perform various social media actions such as posting, commenting, liking, sending friend requests, and resetting passwords using OTP for enhanced security.

## Features
RESTful Architecture: Utilizes Express.js for efficient routing control and handling HTTP requests.
User Authentication: Implements signup, login, logout, and logout from all devices functionalities. Provides extra security by storing login tokens and supports advanced features like updating user profiles.
Post Management: Supports CRUD operations for posts with fields like caption and image URL. Ensures each post references the user who created it.
Comment System: Allows users to add, update, and delete comments on posts. Comments can be managed by the post owner or the commenter.
Like Functionality: Provides like system for posts with logic implemented using MongoDB. Displays counts of likes and comments on posts.
Friendship Features: Implements friendship system with features like getting user friends, managing pending friend requests, and accepting/rejecting friend requests.
OTP-Based Password Reset: Includes OTP-based password reset feature for enhanced security.
Error Handling and Logging: Implements error handling middleware and request logging for improved debugging and monitoring.
## Project Structure
server.js: Contains the server-side logic, setting up the Express server, routing, and MongoDB connection. Handles user authentication, post management, comment system, like functionality, friendship features, OTP-based password reset, error handling, and logging.

- **controllers/:** Contains controller functions for handling various API endpoints.

- **models/:** Defines MongoDB schemas for user, post, comment, like, friendship, and OTP.

- **routes/:** Defines routes for different API endpoints.

- **middlewares/:** Contains middleware functions for authentication, error handling, and logging.

- **config/:** Includes configuration files for MongoDB connection and other settings.
- 
## Usage
1. Clone the repository:
   ```bash
   git clone https://github.com/Supriya9002/SocialSphere
2. Install dependencies:
   ```bash
   npm install
3. Start the server:
   ```bash
   npm start

## API Structure
Authentication Routes
- **/api/users/signup:** Register a new user account.
- **/api/users/signin:** Log in as a user.
- **/api/users/logout:** Log out the currently logged-in user.
- **/api/users/logout-all-devices:** Log out the user from all devices.


## Testing
Thoroughly test the API to ensure it meets the acceptance criteria. Unit tests, integration tests, and end-to-end tests can be implemented using testing frameworks like Jest, Mocha, or Supertest.

## Documentation
Document the application's functionalities, dependencies, API endpoints, and code organization for clarity. Use tools Postman for API documentation.
- **Link To Postman (For Test This APIs)-** https://www.postman.com/mission-participant-11895744/workspace/social-media-api/collection/28528017-a6cf0957-20a4-41f0-bb7d-7318d19b25e3?action=share&creator=28528017

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
Node.js, Express.js, and MongoDB used in the project.

## Author
 Supriya Haldar <br>
 GitHub: https://github.com/Supriya9002/SocialSphere

   
