GuestGlow 🏨✨

   

A modern MERN full‑stack hotel booking app built with React, Express, MongoDB, and Node.js, using Clerk for authentication and Cloudinary for image hosting.

📋 Features

🔑 User Authentication – Sign up / login via Clerk (social login supported)

🏨 Hotel Management – Create, update, delete hotels with images

🔍 Search & Filter – By location, price, rating

📅 Booking System – Real‑time availability

📱 Responsive UI – Mobile‑friendly design

🔒 Secure REST API – Protected routes with Clerk middleware

🛠 Tech Stack

Frontend: ReactJS, React Router, Axios, TailwindCSS (or your chosen CSS)

Backend: Node.js, Express.js, MongoDB + Mongoose

Integrations: Clerk (Auth), Cloudinary (Images)

📂 Folder Structure

guestglow/
├─ client/   # React frontend
├─ server/   # Express backend
└─ README.md

🚀 Getting Started

Prerequisites

Node.js (>= 16)

MongoDB Atlas/local

Clerk account

Cloudinary account

Installation

git clone https://github.com/yourusername/guestglow.git
cd guestglow

# Install backend
tcd server && npm install

# Install frontend
cd ../client && npm install

Environment Variables

server/.env

PORT=5000
MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_SECRET_KEY=your_clerk_secret

client/.env

VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
VITE_API_BASE_URL=http://localhost:5000

▶️ Running the App

Backend:

cd server
npm run dev

Frontend:

cd client
npm run dev

📡 API Endpoints

Method

Endpoint

Description

Auth

GET

/api/hotels

Get all hotels

No

POST

/api/hotels

Create hotel

Yes

GET

/api/hotels/:id

Get hotel details

No

POST

/api/bookings

Create booking

Yes

GET

/api/bookings

Get user bookings

Yes

🔐 Authentication Flow

User logs in via Clerk (frontend)

Clerk issues session token

Frontend sends token with API requests

Backend verifies token using Clerk middleware

🖼 Image Uploads with Cloudinary

const data = new FormData();
data.append('file', file);
data.append('upload_preset', 'unsigned_preset');

const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: 'POST',
  body: data
});

const fileData = await res.json();
console.log(fileData.secure_url);

📌 Future Enhancements

💳 Stripe/PayPal payments

🛎 Advanced filters (amenities, room type)

📊 Admin dashboard

📄 License

MIT License © Emmanuel Gema Kimani

