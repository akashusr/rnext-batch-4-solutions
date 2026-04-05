# 🚀 Assignment 5 – LWS Job Portal

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Backend-Node%20%7C%20Express-orange" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen" />
</p>

<p align="center">
  <strong>A fully functional Job Portal application with complete backend integration</strong><br/>
  Built as <strong>Assignment 5</strong> following real-world full‑stack architecture
</p>

---

## 🧠 Project Overview

**LWS Job Portal** is a **full‑stack job portal system** where companies can post jobs and manage listings, while users can browse, search, filter, and apply for jobs.

Unlike a UI‑only demo, this project includes:

* A **working backend API**
* Real **database-driven job data**
* Role‑based access (Company/Admin perspective)
* Pagination, search, filtering & sorting

This project closely mirrors how a **production-grade job platform** works.

---

## ✨ Key Features

### 👨‍💼 Company / Admin

* Secure authentication
* Create, update, and delete job posts
* View all posted jobs with pagination
* Filter jobs by status (Open / Closed)
* Sort jobs by date, salary, or title

### 👤 Users

* Browse all available job listings
* Search jobs by title or keywords
* Filter and sort jobs dynamically
* View job details
* Users also Can Apply for a job

### ⚙️ System Features

* RESTful API architecture
* Server‑side pagination
* Search & filtering handled by backend
* Clean separation of frontend & backend

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **React Router**
* **Tailwind CSS**
* **Custom Hooks**
* **React Hook Form**
* **Tanstack query**
* **Axios / Fetch API**

### Backend

* **Node.js**
* **Express.js**
* **JWT Authentication**
* **REST API**

---

## 🔌 API Highlights

* `GET /api/jobs` → Fetch all jobs with pagination & filters
* `POST /api/jobs` → Create a new job
* `PATCH /api/jobs/:id` → Update job
* `DELETE /api/jobs/:id` → Delete job

> All protected routes require authentication (Company Admin only)

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB (local or cloud)

### Installation

```bash
# Clone repository
git clone https://github.com/Nasimul650/Assignment-5---LWS-Job-Protal.git

# Install frontend dependencies
npm install

# Run development server
npm run dev
```

> Make sure your backend environment variables are properly configured.

---

## 🧱 Project Structure

```
.
├── client/                # React frontend
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/
│
├── server/                # Backend API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
├── package.json
└── README.md
```

---

## 🔐 Authentication & Security

* JWT‑based authentication
* Role‑protected routes
* Secure API access for company admins
* Environment‑based configuration

---

## 📈 Future Enhancements

* Admin dashboard with more features and analytics
* Email notifications
* Saved jobs & bookmarks
* Deployment with Docker

---

## 👨‍💻 Author

**Nasimul Nasim**
Frontend & Full‑Stack Developer

* GitHub: [https://github.com/Nasimul650](https://github.com/Nasimul650)

---

⭐ If this project helped you or inspired you, don’t forget to **star the repository**!
