# Profile Registration & Management System

## Overview
This project is a **Profile Registration & Management System** that allows users to register, log in, and manage their profiles. The system also provides functionality for updating personal details, uploading profile pictures, and managing other associated data like mobile numbers, country codes, and additional details.

## Features
- **User Authentication**: Supports user registration and login with Passport.js using `passport-local-mongoose`.
- **Profile Management**: 
  - Users can update profile details such as:
    - First Name, Last Name, Email
    - Date of Birth, Gender
    - Mobile Number, Country Code, Address
    - Additional Details
  - Upload and manage profile images, with the option to remove old images automatically.
- **File Upload**: Utilizes `multer` for handling file uploads, including profile pictures and additional image uploads with captions.
- **Profile Display**: A user-friendly interface where users can view and update their profile, with the ability to show and hide sections dynamically.

## Technologies Used
- **Node.js**: Backend framework to create RESTful APIs.
- **Express.js**: Web framework for building the application.
- **MongoDB**: Database for storing user profiles and images.
- **Mongoose**: Object Data Modeling (ODM) for MongoDB.
- **EJS**: Template engine used for rendering views.
- **Passport.js**: Authentication middleware for Node.js.
- **Multer**: Middleware for handling file uploads.
- **UUID**: For generating unique identifiers for uploaded files.
- **Connect-Flash**: Middleware for displaying flash messages in the app.
- **Express-Session**: Session management for handling logged-in users.

## Installation & Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/profile-management-system.git
    ```

2. Navigate to the project directory:
    ```bash
    cd profile-management-system
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file and configure environment variables like MongoDB connection string, session secret, etc. Example:
    ```bash
    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret
    ```

5. Start the application in development mode:
    ```bash
    npm run dev
    ```

6. Open the browser and go to:
    ```
    http://localhost:3000
    ```

## Folder Structure
```bash
├── public
│   ├── images
│   └── stylesheets
├── views
│   ├── profile.ejs
│   └── other-views.ejs
├── controllers
│   └── profile.js
├── models
│   ├── user.js
│   └── image.js
├── routes
│   └── userRoutes.js
└── app.js

