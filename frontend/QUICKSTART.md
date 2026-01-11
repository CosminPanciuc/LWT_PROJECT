# Quick Start Guide

## Prerequisites

1. **Backend must be running** on `http://localhost:4000/graphql`
   
   To start the backend:
   ```bash
   cd c:\Users\Kime\lw\backend
   npm install
   npm start
   ```

2. **Node.js 16+** installed

## Starting the Frontend

1. Open terminal in the frontend directory
2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to: `http://localhost:5173`

## Test the Application

### As a Buyer:
1. Click "Get Started" or "Login"
2. Register a new account with role "Buyer"
3. Browse products on the Products page
4. Click on a product to view details
5. Add products to cart
6. Go to Cart and checkout
7. View your orders

### As a Seller:
1. Register with role "Seller"
2. Navigate to "My Products" in the navbar
3. Click "+ Add Product"
4. Fill in product details (you can use placeholder image URLs like `https://via.placeholder.com/300`)
5. View, edit, or delete your products in the dashboard

## Sample Image URLs for Testing

Use these free placeholder images when adding products:
- `https://via.placeholder.com/300/FF0000/FFFFFF?text=Product`
- `https://via.placeholder.com/300/00FF00/FFFFFF?text=Electronics`
- `https://via.placeholder.com/300/0000FF/FFFFFF?text=Fashion`

## Troubleshooting

### Backend not connecting
- Ensure backend is running on port 4000
- Check console for GraphQL errors
- Verify `apollo-client.ts` has correct URL

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Restart the dev server

### TypeScript errors
- Make sure all dependencies are installed
- Try restarting VS Code

## Project Structure

- `/src/pages` - All page components
- `/src/components` - Reusable UI components
- `/src/context` - Global state (Auth, Cart)
- `/src/graphql` - GraphQL queries and mutations
- `/src/types.ts` - TypeScript type definitions
- `/src/apollo-client.ts` - Apollo Client config

## Features Implemented

✅ User Authentication (Login/Register)
✅ Product Listing with Filters
✅ Product Detail Pages
✅ Shopping Cart
✅ Checkout & Orders
✅ Product Reviews
✅ Seller Dashboard
✅ Add/Edit/Delete Products
✅ Protected Routes
✅ Responsive Design
