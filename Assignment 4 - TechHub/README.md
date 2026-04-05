# TechHub

A modern e-commerce platform for tech products built with React, TailwindCSS. TechHub provides a seamless shopping experience with product filtering, sorting, search functionality, and a fully-featured shopping cart system.

<img src="/public/techhub-home-page.png" alt="TechHub Home Page" />

![React](https://img.shields.io/badge/React-19.2.0-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-38bdf8) ![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff)

## 🔗 Links

-   **Live Demo**: [https://techhub-454.vercel.app](https://techhub-454.vercel.app)
-   **Repository**: [GitHub](https://github.com/Learn-with-Sumit/batch-4-assignment-4-techhub-tushar-454)

## 🌟 Features

-   🛍️ **Product Catalog** - Browse through a wide range of tech products
-   🔍 **Advanced Search** - Real-time search with debouncing for optimal performance
-   🎯 **Smart Filtering** - Filter products by category, price range, and availability
-   📊 **Dynamic Sorting** - Sort products by price, or created date
-   🛒 **Shopping Cart** - Add, remove, and manage cart items with quantity controls
-   💰 **Order Summary** - Real-time calculation of subtotal, taxes, and total
-   📱 **Responsive Design** - Fully responsive UI that works on all devices
-   ⚡ **Fast Performance** - Built with Vite for lightning-fast development and production builds
-   🎨 **Modern UI** - Clean and intuitive interface with TailwindCSS
-   🔄 **State Management** - Efficient state management using React Context API
-   💾 **Persistent Cart** - Shopping cart persists in database

## 🚀 Getting Started

### Prerequisites

-   Node.js (v24.11.1)
-   npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/Learn-with-Sumit/batch-4-assignment-4-techhub-tushar-454.git
cd batch-4-assignment-4-techhub-tushar-454
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Built With

-   **React** (v19.2.0) - A JavaScript library for building user interfaces
-   **TailwindCSS** (v4.1.17) - A utility-first CSS framework
-   **Vite** (v7.2.4) - Next generation frontend tooling
-   **React DOM** (v19.2.0) - React package for working with the DOM
-   **ESLint** (v9.39.1) - JavaScript linting utility

## 📂 Project Structure

```
techhub/
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, fonts, and other assets
│   ├── components/      # Reusable UI components
│   │   ├── icons/       # SVG icon components
│   │   └── seletons/    # Loading skeleton components
│   ├── contexts/        # React Context definitions
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── providers/       # Context providers
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Project dependencies
├── vite.config.js       # Vite configuration
└── eslint.config.js     # ESLint configuration
```

## 🌲 Components Tree

![Components Tree](/public/TechHub.drawio.svg)

## 🎯 Key Components

### **`ProductContextProvider`**

Manages global product state including product data fetching, search, filtering, and sorting logic. This provider wraps the entire application to make product data available throughout the component tree.

### **`CartContextProvider`**

Handles all shopping cart operations including adding/removing items, updating quantities, and calculating totals. Implements database persistence to maintain cart state across sessions.

### **`SearchSortFilterContextProvider`**

Centralized state management for search queries, sorting preferences, and filter selections. Implements debounced search for optimal performance.

### **`ProductItems`**

Displays the grid of products with loading states and empty states. Integrates with filtering and sorting context to show relevant products.

### **`Cart`**

Complete shopping cart interface with item management, quantity controls, and real-time order summary calculations including subtotal, taxes, and shipping.

### **`ProductFilters`**

Dynamic filtering component that allows users to filter products by category, price range, and stock availability with real-time updates.

## 👨‍💻 Author

**Tushar**

-   GitHub: [@tushar-454](https://github.com/tushar-454)
-   Repository: [batch-4-assignment-4-techhub-tushar-454](https://github.com/Learn-with-Sumit/batch-4-assignment-4-techhub-tushar-454)

---

<div align="center">
  
### ⭐ Star this repository if you find it helpful!

Made with ❤️ using React & TailwindCSS

</div>
