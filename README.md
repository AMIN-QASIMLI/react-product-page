# React + TypeScript + Vite

# 🛒 Amazon-Style E-Commerce Web App

## You can look this project in netlify by this link -> 
```
https://react-product-page-by-amin.netlify.app
```
---

A modern Amazon-like e-commerce web application built with **React**, **Zustand**, **RTK Query**, **Axios**, and **Chakra UI**. The project demonstrates scalable state management, API integration, and a responsive, accessible UI.

---

## 🚀 Features

- Product listing & details pages
- Search and category filtering
- Shopping cart with persistent state (Zustand)
- Authentication-ready architecture
- API data fetching & caching (RTK Query + Axios)
- Responsive UI with Chakra UI
- Loading & error handling states
- Clean and modular architecture

---

## 🧰 Tech Stack

| Technology | Usage |
|------------|--------|
| React | UI library |
| Zustand | Global state management |
| RTK Query | Server state, caching, and API handling |
| Axios | HTTP client |
| Chakra UI | Component library & styling |
| React Router | Client-side routing |

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/amin-qasimli/react-product-page.git
cd amazon-clone

Install dependencies:

npm install

Start development server:

npm run dev
```

🔌 API Configuration

Create a .env file in the root directory:
```
VITE_API_BASE_URL=https://product-server-v082.onrender.com/
```

RTK Query uses this base URL to fetch products and user data.
🗂️ Project Structure

src/
├── app/                # Redux store and RTK Query setup
├── api/                # API slices
├── components/         # Reusable UI components
├── features/           # Feature-based modules (cart, auth, products)
├── pages/              # Route pages
├── store/              # Zustand stores
├── routes/             # Route definitions
└── main.jsx            # Entry point

🛍️ Cart State (Zustand Example)

import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => ({ cart: [...state.cart, product] })),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter(p => p.id !== id) }))
}));

🧪 Scripts
Command	Description
npm run dev	Start dev server
npm run build	Build for production
npm run preview	Preview production build
🌍 Deployment

You can deploy this project on:

    Vercel

    Netlify

    Cloudflare Pages

📄 License

This project is licensed under the MIT License.
👨‍💻 Author

Amin
Front-End Developer
GitHub: https://github.com/amin-qasimli

## ⭐ If you like this project, consider giving it a star!
