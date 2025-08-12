GuestGlow 🏨✨
A MERN Fullstack Hotel Booking Application

GuestGlow is a modern hotel booking platform built with the MERN stack, integrating Clerk for authentication, Cloudinary for image storage, and a responsive ReactJS front-end for an intuitive user experience.

🚀 Features
User Authentication & Management via Clerk (Sign up, Login, Social logins).

Hotel Management – Add, edit, and delete hotels with images.

Image Uploads – Seamless upload and storage using Cloudinary.

Search & Filter – Find hotels by location, price, and rating.

Booking System – Reserve rooms with real-time availability updates.

Responsive Design – Works on desktop, tablet, and mobile.

Secure REST API – Express backend with protected routes.

🛠 Tech Stack
Frontend:

ReactJS (with Hooks & Context API / Redux)

TailwindCSS / Styled Components (if used)

Axios

Backend:

Node.js

Express.js

MongoDB + Mongoose

Integrations:

Clerk – Authentication & User Management

Cloudinary – Image Upload & Hosting

📦 Installation
1️⃣ Clone the repository
bash
Copy
Edit
git clone https://github.com/yourusername/guestglow.git
cd guestglow
2️⃣ Install dependencies
Frontend:

bash
Copy
Edit
cd client
npm install
Backend:

bash
Copy
Edit
cd server
npm install
3️⃣ Environment variables
Create .env files in both server and client directories.

Server .env

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Client .env

ini
Copy
Edit
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:5000
4️⃣ Run the app
Backend:

bash
Copy
Edit
cd server
npm run dev
Frontend:

bash
Copy
Edit
cd client
npm run dev
📸 Screenshots
(Add your app screenshots here using Cloudinary URLs)
Example:

📜 API Endpoints
Method	Endpoint	Description	Auth Required
GET	/api/hotels	Get all hotels	No
POST	/api/hotels	Create a hotel listing	Yes
GET	/api/hotels/:id	Get hotel by ID	No
POST	/api/bookings	Create a booking	Yes
GET	/api/bookings	Get user bookings	Yes

🔒 Authentication Flow
Users sign up/login via Clerk.

Clerk issues a JWT/session token.

Backend verifies token for protected routes.

🌟 Future Improvements
Payment integration (Stripe/PayPal).

Advanced search filters (amenities, room type).

Admin dashboard for hotel owners.

Email notifications for bookings.

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature-name)

Commit changes (git commit -m "Add new feature")

Push to branch (git push origin feature-name)

Create a Pull Request

📄 License
This project is licensed under the MIT License.

