🏨 GuestGlow: A MERN Stack Hotel Booking App
📝 Introduction
GuestGlow is a full-stack hotel booking application that allows users to browse available hotels, view detailed information, and make reservations. It leverages the power of the MERN stack (MongoDB, Express.js, React.js, Node.js) combined with modern services like Clerk for authentication and Cloudinary for image management, creating a seamless and robust user experience

✨ Features
Secure User Authentication: Users can sign up, sign in, and manage their profiles securely using Clerk.

Hotel Listings: Browse a variety of hotels with detailed descriptions, amenities, and image galleries.

Image Upload: Hotel owners can upload multiple images for their listings using Cloudinary.

Booking Management: Users can view their past and upcoming bookings.

Admin Dashboard: A dedicated interface for managing hotels and bookings.

Responsive Design: A clean and modern user interface that works well on all devices.

🛠️ Technologies Used
Frontend
React.js: A JavaScript library for building the user interface.

Tailwind CSS: A utility-first CSS framework for rapid and responsive styling.

Clerk: A complete user management platform for authentication.

React Query: For fetching, caching, and updating asynchronous data.

Backend
Node.js & Express.js: The backend runtime and web framework for building the API.

MongoDB: A NoSQL database for storing application data.

Mongoose: An object data modeling (ODM) library for MongoDB and Node.js.

Cloudinary: A cloud-based service for image and video management, handling uploads and storage.

Clerk: Used for validating user authentication on the backend.

🚀 Getting Started
Follow these steps to get your GuestGlow application up and running on your local machine.

Prerequisites
Node.js (v14.x or later)

npm or yarn

A running instance of MongoDB

Accounts for Clerk and Cloudinary

Installation
Clone the repository:

git clone https://github.com/your-username/GuestGlow.git
cd GuestGlow

Set up the Backend:

Navigate to the backend directory.

cd backend

Install dependencies.

npm install

Create a .env file in the backend directory and add the following environment variables:

MONGO_URI=<Your MongoDB connection string>
CLERK_WEBHOOK_SECRET=<Your Clerk webhook secret>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary cloud name>
CLOUDINARY_API_KEY=<Your Cloudinary API key>
CLOUDINARY_API_SECRET=<Your Cloudinary API secret>
JWT_SECRET=<A secret key for JWT>

Start the backend server.

npm start

Set up the Frontend:

Navigate back to the root directory and then into the frontend directory.

cd ../frontend

Install dependencies.

npm install

Create a .env file in the frontend directory and add the following environment variables:

VITE_CLERK_PUBLISHABLE_KEY=<Your Clerk publishable key>
VITE_API_BASE_URL=<Your backend API base URL, e.g., http://localhost:5000/api>

Start the frontend development server.

npm run dev

The application should now be running! You can access the frontend at http://localhost:5173 (or the port specified by your development server) and the backend API at http://localhost:5000.

📂 Project Structure
GuestGlow/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── ...
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── ...
│   ├── .env
│   ├── package.json
│   └── ...
└── README.md

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
