## Features

- 🔐 **Authentication**: User registration and login with JWT tokens
- 🛍️ **Product Browsing**: Browse, filter, and search products by category, condition, and price
- 🛒 **Shopping Cart**: Add products to cart and manage quantities
- 📦 **Order Management**: View order history and track order status
- ⭐ **Reviews**: Rate and review products
- 💼 **Seller Dashboard**: Manage your products (add, edit, delete)
- 🎨 **Modern UI**: Built with Tailwind CSS for a responsive, beautiful design

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Apollo Client** for GraphQL data management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Context API** for state management (Auth & Cart)

## Prerequisites

- Node.js 16+ and npm
- Backend server running on http://localhost:4000/graphql

## Installation

1. Install dependencies:
\\\ash
npm install
\\\

2. Start the development server:
\\\ash
npm run dev
\\\

The app will be available at http://localhost:5173

## Backend Connection

The frontend connects to the GraphQL backend at http://localhost:4000/graphql. 

To start the backend:
\\\ash
cd ../backend
npm install
npm start
\\\

## User Roles

### Buyer
- Browse and search products
- Add products to cart
- Place orders
- Write reviews
- View order history

### Seller
- All buyer features
- Add new products
- Edit/delete own products
- View products in seller dashboard

## Available Scripts

- npm run dev - Start development server
- npm run build - Build for production
- npm run preview - Preview production build

## License

MIT
