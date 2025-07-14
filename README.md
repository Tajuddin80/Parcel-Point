# 📦 Parcel Point – A Smart Parcel Delivery Management System

Parcel Point is a full-stack web application built with the MERN stack, designed to simplify and manage parcel delivery processes. The platform supports real-time tracking, role-based dashboards (User, Rider, Admin), Stripe payments, and powerful admin analytics. Ideal for small logistics businesses or educational portfolio projects.

## 🌐 Live Demo

🔗 [Parcel Point Live](https://parcel-point-bc3e2.web.app/)

---

## 🚀 Key Features

### ✅ User Features
- Register/login via Firebase Authentication
- Book parcels with sender/receiver info, address, and cost
- Pay online via Stripe
- Track parcel status (Booked → Assigned → In-transit → Delivered)
- View booking history with filters

### 🚴 Rider Features
- Login to see assigned parcels
- Change delivery status to `in-transit` or `delivered`
- Track completed deliveries and earnings

### 🛠️ Admin Features
- Dashboard for managing all parcels, users, riders, and service areas
- Assign riders based on region/district/warehouse
- Analytics on revenue, delivery counts, and more using MongoDB aggregation
- Update parcel statuses, suspend/verify users

---

## 💻 Tech Stack

### 🧠 Frontend
- React + Vite
- Tailwind CSS + DaisyUI
- React Router DOM
- Firebase Authentication
- Axios + React Query
- Lottie, Framer Motion, SweetAlert2

### 🔧 Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT for secure access
- Firebase Admin SDK for token validation
- Stripe for payment gateway
- CORS, Dotenv

---


## ⚙️ Installation & Setup

### 🔑 Prerequisites
- Node.js
- MongoDB
- Firebase project (for Auth + Admin SDK)
- Stripe account

### 1️⃣ Clone the repo
```bash
https://github.com/Tajuddin80/Parcel-Point/

cd Parcel-Point-Client
npm install
npm run dev


cd Parcel-Point-Server
npm install
# Create a .env file with required variables:
# PORT=5000
# MONGO_URI=your_mongo_connection
# STRIPE_SECRET_KEY=your_stripe_key
# FIREBASE_TYPE=service_account_type
# FIREBASE_PROJECT_ID=...
npm run dev

🧪 API Endpoints (Sample)
Auth
POST /jwt – issue token after login

GET /users – fetch all users (admin only)

Parcels
POST /parcels – create new booking

GET /parcels/user/:email – get user bookings

PATCH /parcels/:id/status – update delivery status

Payments
POST /create-payment-intent

POST /payments

🔐 Authentication
Firebase Authentication (Client)

JWT (Backend)

Firebase Admin SDK (Token validation)

📈 Future Improvements
Real-time status updates with Socket.IO
Google Maps integration for delivery route tracking
Push notifications for delivery updates
Rider location tracking

📈 Credits
Developed by Taj Uddin
Email: tajuddin.cse.dev@gmail.com



