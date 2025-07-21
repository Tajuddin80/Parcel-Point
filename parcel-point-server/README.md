# 🚀 Parcel Point – Backend (Server)

This is the backend API for **Parcel Point**, a parcel management system.  
It provides secure REST endpoints for authentication, parcel management, payments (via Stripe), and email notifications.  
Built with **Node.js**, **Express**, **MongoDB**, and **Firebase Admin**.

---

## ✨ Features

✅ **Express.js REST API** with clean route structure  
✅ **Firebase Admin** for verifying JWTs & securing routes  
✅ **MongoDB Atlas** integration for storing parcels, users, payments  
✅ **Stripe Payment Processing** with webhook support  
✅ **Nodemailer** for sending email notifications (optional)  
✅ **CORS** enabled for frontend communication  
✅ **Environment-based config** using `dotenv`

---

## 📦 Tech Stack

| Library / Tool | Purpose |
|----------------|---------|
| [Express.js](https://expressjs.com/) | Server framework |
| [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/) | Database access |
| [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) | Verify Firebase ID tokens |
| [Stripe](https://stripe.com/docs/api) | Payment processing |
| [Nodemailer](https://nodemailer.com/about/) | Sending emails |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variables |
| [cors](https://github.com/expressjs/cors) | Enable CORS |

---

## 🚀 Getting Started

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- MongoDB Atlas or local MongoDB connection string
- A Firebase Service Account key (JSON)
- A Stripe Secret Key

---

### 📥 Installation

Clone the backend repository and install dependencies:

```bash
git clone https://github.com/Tajuddin80/Parcel-Point
cd parcel-point-server
npm install


⚙️ Environment Variables
Create a .env file in the project root with these keys:
PORT=5000
MONGODB_URI=your-mongodb-connection-string
STRIPE_SECRET_KEY=your-stripe-secret-key
FIREBASE_SERVICE_ACCOUNT_KEY=./path/to/your-service-account.json
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password



📂 Project Structure
parcel-point-server/
│
├── index.js             # Entry point
├── .env                 # Environment variables (not committed)
├── routes/              # API route files
├── middleware/          # Auth & security middlewares
├── services/            # Database or email services
└── utils/               # Helper functions
\


🔒 Security Notes
Never expose your Firebase service account JSON or Stripe keys in client-side code.
Rotate or regenerate keys if they were ever committed to GitHub.
Use .gitignore to prevent committing sensitive files:
.env
parcel-point-firebase-key.json


🤝 Contributing
Fork the repo
Create a feature branch (git checkout -b feature/my-feature)
Commit your changes (git commit -m 'Add my feature')
Push to your fork (git push origin feature/my-feature)
Open a Pull Request

