# 🚚 Parcel Point – Frontend

A modern parcel management web app frontend built with **React 19**, **Tailwind CSS 4**, **TanStack React Query**, **Stripe**, and more.  
This frontend communicates with a backend API for managing parcels, payments, riders, and user dashboards.

---

## ✨ Features

✅ **User Authentication** – Firebase Auth (Email/Password, Google Sign-In)  
✅ **Parcel Booking & Tracking** – Dynamic forms with `react-hook-form`  
✅ **Stripe Payments** – Integrated with `@stripe/react-stripe-js`  
✅ **Interactive Maps** – Warehouse coverage map using `leaflet` & `react-leaflet`  
✅ **Modern UI/UX** – Built with TailwindCSS, Framer Motion, AOS animations, Lottie  
✅ **Data Fetching & Caching** – Powered by TanStack React Query  
✅ **Charts & Stats** – Parcel analytics using `recharts`  
✅ **Responsive Carousel** – For banners & announcements  
✅ **Responsive & Mobile-Friendly** – TailwindCSS 4 with latest Vite integration

---

## 📦 Tech Stack

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

## 🚀 Getting Started

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- A Firebase project for authentication
- Stripe publishable key for payments
- Backend API URL (see `.env` section below)

---

### 📥 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Tajuddin80/Parcel-Point
cd parcel-point
npm install


🛠️ Project Structure
src/
  components/       # Reusable UI components
  pages/            # Route pages
  hooks/            # Custom React hooks (e.g., useAxiosSecure)
  context/          # Context providers (Auth, etc.)
  routes/           # Route definitions
  utils/            # Utility functions
  assets/           # Images, Lottie files

✨ Contributing
Fork the repo
Create a new branch (git checkout -b feature/my-feature)
Commit changes (git commit -m 'Add some feature')
Push to branch (git push origin feature/my-feature)
Open a Pull Request


❤️ Acknowledgements
Stripe
Firebase
TanStack
Tailwind CSS

Developed by: Taj Uddin
Repository: Parcel Point Frontend

