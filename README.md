# 📦 Parcel Point – Full Stack (Frontend & Backend)

**Parcel Point** is a modern parcel management system with a **React 19** frontend and a **Node.js/Express** backend.  
It supports **user authentication (Firebase)**, **parcel booking & tracking**, **Stripe payments**, **email notifications**, and **interactive analytics**.

---

## ✨ Features

✅ **User Authentication** – Firebase Auth (Email/Password, Google Sign-In)  
✅ **Parcel Booking & Tracking** – Manage parcels with dynamic forms  
✅ **Stripe Payments** – Secure payment handling  
✅ **Interactive Maps** – Warehouse coverage using Leaflet  
✅ **Modern UI/UX** – TailwindCSS 4, Framer Motion, AOS, Lottie  
✅ **Data Fetching & Caching** – TanStack React Query  
✅ **Charts & Stats** – Parcel analytics using Recharts  
✅ **Email Notifications** – Powered by Nodemailer  
✅ **Secure REST API** – JWT verification with Firebase Admin  
✅ **MongoDB Atlas Integration** – Persistent storage

---

## 🖥️ Tech Stack Overview

| Layer | Tools & Libraries |
|-------|------------------|
| Frontend | React 19, Tailwind CSS 4, Vite, React Router v7, React Query, React Hook Form, Stripe JS, Framer Motion, AOS, Lottie React, React Leaflet, Recharts, SweetAlert2 |
| Backend | Node.js, Express, MongoDB, Firebase Admin SDK, Stripe, Nodemailer, dotenv, cors |

---

# 🚚 Frontend

A modern parcel management web app frontend built with **React 19**, **Tailwind CSS 4**, and **Vite**.

### 📦 Tech Stack (Frontend)

| Library / Tool | Purpose |
|----------------|---------|
| [React 19](https://react.dev/) | Core frontend framework |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Vite](https://vitejs.dev/) with `@tailwindcss/vite` | Build & dev server |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [React Query](https://tanstack.com/query/latest) | Data fetching & caching |
| [React Hook Form](https://react-hook-form.com/) | Form handling & validation |
| [Stripe JS](https://stripe.com/docs/js) | Payment processing |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [AOS](https://michalsnik.github.io/aos/) | Scroll animations |
| [Lottie React](https://github.com/LottieFiles/lottie-react) | Lottie animations |
| [React Leaflet](https://react-leaflet.js.org/) & [Leaflet](https://leafletjs.com/) | Interactive maps |
| [Recharts](https://recharts.org/) | Charts & data visualization |
| [SweetAlert2](https://sweetalert2.github.io/) | Pop-up alerts |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon library |

---

## 📦 Tech Stack (Backend)

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


| Library / Tool | Purpose |
|----------------|---------|
| React 19 | Core frontend framework |
| Backend |  Node.js, Express, MongoDB, Firebase Admin SDK, Stripe, Nodemailer, dotenv, cors |
| Vite | Build & dev server |
| React Router v7 | Client-side routing |
| React Query | Data fetching & caching |
| React Hook Form | Form handling & validation |
| Stripe JS | Payment processing |
| Framer Motion | Animations |
| AOS | Scroll animations |
| Lottie React | Lottie animations |
| React Leaflet | Interactive maps |
| Recharts | Charts & data visualization |
| SweetAlert2 | Pop-up alerts |
| React Icons | Icon library |

---

### 🔧 Prerequisites (Frontend)

- [Node.js](https://nodejs.org/) >= 18
- A Firebase project for authentication
- Stripe publishable key for payments
- Backend API URL (see `.env` section below)

---

### 📥 Installation (Frontend)

```bash
git clone https://github.com/Tajuddin80/Parcel-Point
cd parcel-point
npm install



Create a .env file:
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_STRIPE_PUBLIC_KEY=your-stripe-publishable-key


Run locally:
npm run dev

📂 Project Structure (Backend)
src/
  components/       # Reusable UI components
  pages/            # Route pages
  hooks/            # Custom React hooks
  context/          # Context providers
  routes/           # Route definitions
  utils/            # Utility functions
  assets/           # Images, Lottie files


🔒 Security Notes
Never expose your Firebase service account JSON or Stripe keys in client-side code.
Add these to .gitignore:
.env
parcel-point-firebase-key.json
If sensitive files were ever committed, rotate your keys and remove them from history.

✨ Contributing
Fork the repo
Create a new branch (git checkout -b feature/my-feature)
Commit your changes (git commit -m 'Add my feature')
Push to your fork (git push origin feature/my-feature)
Open a Pull Request


❤️ Acknowledgements
Stripe
Firebase
TanStack
Tailwind CSS
MongoDB

Developed by: Taj Uddin
Repository: https://github.com/Tajuddin80/Parcel-Point
