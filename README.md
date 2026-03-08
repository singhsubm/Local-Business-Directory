# 🚀 LocalFinder -- Service Discovery & Booking Platform

![React](https://img.shields.io/badge/Frontend-React.js-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

LocalFinder is a **modern location‑based service discovery and booking
platform** that connects users with nearby businesses and independent
professionals.

It combines the functionality of platforms like **Urban Company,
JustDial, and Zomato** into one unified ecosystem where users can
discover, contact, and book local services easily.

------------------------------------------------------------------------

# 🌟 Features

## 🏢 Dual Listing Ecosystem

### Shops (Physical Businesses)

-   Exact Google Maps location integration
-   Operating hours management
-   Walk‑in support
-   Seating / slot configuration
-   Full business profile with media

### Independent Professionals

-   Privacy‑focused profiles
-   Exact location hidden
-   Operational radius based services
-   Distance visibility
-   Tools and vehicle availability flags

------------------------------------------------------------------------

# 📍 Location Based Discovery

### Real‑Time Distance Calculation

LocalFinder uses the **Haversine Formula** to calculate the distance
between users and service providers.

### Radius Filter

Users can search services within:

-   2 km
-   5 km
-   10 km
-   20 km

### Smart Search Filters

Users can filter services by:

-   Category
-   Ratings
-   Distance
-   Verified professionals

------------------------------------------------------------------------

# 💼 Provider Dashboard

Service providers get a powerful dashboard to manage their listings.

### Status Toggle

Providers can instantly switch between:

-   🟢 Online / Open
-   🔴 Offline / Closed

### Booking Management

Providers can:

-   Accept bookings
-   Reject inquiries
-   Manage customer requests

### Media Gallery

Providers can upload:

-   Up to **10 images**
-   Up to **3 videos**

Media removed from dashboard is automatically deleted from
**Cloudinary**.

------------------------------------------------------------------------

# ⭐ Review & Rating System

Users can leave:

-   Star ratings
-   Written reviews

The platform dynamically calculates **average ratings for each
provider**.

------------------------------------------------------------------------

# 🛠 Tech Stack

## Frontend

-   React.js (Vite)
-   Tailwind CSS
-   Framer Motion
-   React Router DOM
-   React Icons
-   React Toastify

## Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose

## Media Handling

-   Cloudinary
-   Multer

## Authentication

-   JWT (JSON Web Token)

------------------------------------------------------------------------

# 📂 Project Structure

    LocalFinder
    │
    ├── client
    │   ├── src
    │   │   ├── components
    │   │   ├── pages
    │   │   ├── context
    │   │   └── utils
    │
    └── server
        ├── controllers
        ├── models
        ├── routes
        ├── utils
        └── server.js

------------------------------------------------------------------------

# ⚙️ Installation & Setup

## 1. Clone Repository

    git clone https://github.com/singhsubm/Local-Business-Directory.git
    cd LocalFinder

------------------------------------------------------------------------

# Backend Setup

    cd server
    npm install

Create `.env` file in **server folder**

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

Run backend

    npm run dev

------------------------------------------------------------------------

# Frontend Setup

Open another terminal

    cd client
    npm install

Create `.env` file

    VITE_API_URL=http://localhost:5000/api

Start frontend

    npm run dev

------------------------------------------------------------------------

# 🚀 Future Improvements

-   Payment Integration (Stripe / Razorpay)
-   Real‑time chat using Socket.io
-   Advanced Admin Dashboard
-   Provider analytics and insights

------------------------------------------------------------------------

# 🤝 Contributing

Contributions are welcome.

1.  Fork the repository
2.  Create a new branch
3.  Commit changes
4.  Submit a pull request

------------------------------------------------------------------------

# 📄 License

This project is licensed under the **MIT License**.

------------------------------------------------------------------------

# 👨‍💻 Author

**Shubham Singh**

If you like this project, consider giving it a ⭐ on GitHub.
