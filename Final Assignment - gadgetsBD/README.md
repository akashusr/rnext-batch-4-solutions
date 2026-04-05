# 🛒 Gadgets BD — Premium Tech Marketplace

A full-stack e-commerce platform for gadgets and electronics, built with **Next.js 14**, **MongoDB**, and **TypeScript**. Features dual user roles (Customer & Shop Owner), Google OAuth, product comparison with AI-powered Best Buy analysis, and a complete order management system.

> **Assignment 9** — Learn with Sumit (LWS)

**Live Demo:** [https://gadgets-bd-astro.vercel.app](https://gadgets-bd-astro.vercel.app)

---

## 🌐 Project Overview

Gadgets BD is an Amazon-inspired multi-vendor marketplace where **shop owners** can create their stores, manage inventory, and fulfill orders, while **customers** can browse products, compare specs, add to cart, place orders, leave reviews, and manage wishlists. The platform supports secure authentication via email/password and Google OAuth, image hosting via ImageKit CDN, email notifications via Nodemailer, and PDF invoice generation.

### Core Functionality
- **Multi-Vendor System** — Shop owners register, set up profiles, and manage their own product inventories
- **Product Catalog** — Browse, search, filter, and sort products by category, price, brand, and rating
- **Shopping Cart & Checkout** — Full cart management with a secure checkout flow
- **Order Management** — Place orders, track status, cancel, and download PDF invoices
- **Product Reviews** — Rate and review purchased products with image uploads
- **Authentication** — Email/password registration, Google OAuth, password reset via email OTP
- **Role-Based Access** — Separate dashboards and permissions for Customers and Shop Owners

---

## ✨ Newly Added Features

### ❤️ Wishlist System
Save products for later with a heart icon on product cards. Dedicated `/wishlist` page to manage saved items.

### ⚖️ Product Comparison
Compare up to 3 products side-by-side with detailed spec breakdowns. Uses localStorage for persistent selection.

### 🏆 Best Buy Analysis
AI-powered recommendation engine on the comparison page that scores and ranks products across 6 weighted categories:

| Factor | Weight | Logic |
|---|---|---|
| **Price** | 30% | Lower price = higher score |
| **Rating** | 25% | Higher average rating = better |
| **Features** | 15% | More features = richer product |
| **Reviews** | 10% | More reviews = more trustworthy |
| **Specs** | 10% | More specifications = more detailed |
| **Stock** | 10% | Higher availability = better |

Includes a winner card with trophy badge, animated score bars, category winners grid, and auto-generated reasoning.

### 📧 Order Email Notifications
Confirmation and status update emails sent via Nodemailer when orders are placed or updated.

### 👤 User Account Page
View and edit profile information at `/account`.

### 📊 Shop Owner Analytics Dashboard
Revenue overview, top-selling products, and recent orders at `/shop-owner/dashboard`.

### 🏷️ Stock Alert Badges
Dynamic badges on product cards: "Out of Stock", "Only X left!", with cart validation to prevent ordering unavailable items.

### 🔔 Toast Notification System
Replaced all ~30 `alert()` calls with beautiful animated toast notifications (success, error, info variants).

### 🕐 Recently Viewed Products
Automatically tracks and displays the last 8 viewed products on product detail pages.

### ⬆️ Floating Scroll-to-Top Button
Global button that appears when scrolling down, smoothly scrolls back to top.

### 💀 Loading Skeletons
Animated placeholder skeletons for products, wishlist, and orders pages while data loads.

### 📦 Order Status Timeline
Visual step-by-step progress bar on orders page, replacing plain status text badges.

### 🔍 Product Image Hover Zoom
Magnifying lens effect on product detail page images for closer inspection.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Database** | MongoDB Atlas + Mongoose |
| **Authentication** | NextAuth.js (Credentials + Google OAuth) |
| **Styling** | Tailwind CSS 4 |
| **Image CDN** | ImageKit |
| **Email** | Nodemailer (Gmail SMTP) |
| **PDF Generation** | PDFKit |
| **Icons** | Lucide React |
| **Validation** | Zod |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd gadgets-bd
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 👨‍💻 Author

**Nabil Axelman**

---

## 📝 License

This project is part of the Learn with Sumit (LWS) coursework.
