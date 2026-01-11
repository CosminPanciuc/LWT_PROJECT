import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from './auth.js';

export const db = {
  users: [],
  products: [],
  orders: [],
  reviews: [],
};

export const initializeMockupData = async () => {
  db.users = [
    {
      id: '1',
      email: 'john@seller.com',
      password: await hashPassword('password123'),
      name: 'John Doe',
      role: 'SELLER',
      phone: '+1234567890',
      address: '123 Main St, New York, NY',
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: '2',
      email: 'jane@buyer.com',
      password: await hashPassword('password123'),
      name: 'Jane Smith',
      role: 'BUYER',
      phone: '+1987654321',
      address: '456 Oak Ave, Los Angeles, CA',
      createdAt: new Date('2024-02-20').toISOString(),
    },
    {
      id: '3',
      email: 'bob@seller.com',
      password: await hashPassword('password123'),
      name: 'Bob Johnson',
      role: 'SELLER',
      phone: '+1122334455',
      address: '789 Pine Rd, Chicago, IL',
      createdAt: new Date('2024-03-10').toISOString(),
    },
    {
      id: '4',
      email: 'alice@buyer.com',
      password: await hashPassword('password123'),
      name: 'Alice Williams',
      role: 'BUYER',
      phone: '+1555666777',
      address: '321 Elm St, Miami, FL',
      createdAt: new Date('2024-04-05').toISOString(),
    },
  ];

  db.products = [
    {
      id: '101',
      title: 'iPhone 15 Pro',
      description: 'Latest iPhone with A17 Pro chip, titanium design, and amazing camera system',
      price: 999.99,
      category: 'ELECTRONICS',
      condition: 'NEW',
      status: 'ACTIVE',
      images: ['https://example.com/iphone15-1.jpg', 'https://example.com/iphone15-2.jpg'],
      stock: 15,
      sellerId: '1',
      createdAt: new Date('2024-05-01').toISOString(),
    },
    {
      id: '102',
      title: 'MacBook Pro 16"',
      description: 'M3 Max chip, 36GB RAM, 1TB SSD. Perfect for developers and creators',
      price: 2499.99,
      category: 'ELECTRONICS',
      condition: 'NEW',
      status: 'ACTIVE',
      images: ['https://example.com/macbook-1.jpg'],
      stock: 8,
      sellerId: '1',
      createdAt: new Date('2024-05-03').toISOString(),
    },
    {
      id: '103',
      title: 'Nike Air Max 2024',
      description: 'Premium running shoes with advanced cushioning technology',
      price: 159.99,
      category: 'SPORTS',
      condition: 'NEW',
      status: 'ACTIVE',
      images: ['https://example.com/nike-1.jpg', 'https://example.com/nike-2.jpg'],
      stock: 25,
      sellerId: '3',
      createdAt: new Date('2024-05-10').toISOString(),
    },
    {
      id: '104',
      title: 'Leather Sofa - 3 Seater',
      description: 'Genuine leather sofa in excellent condition, barely used',
      price: 499.99,
      category: 'HOME',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      images: ['https://example.com/sofa-1.jpg'],
      stock: 3,
      sellerId: '3',
      createdAt: new Date('2024-05-15').toISOString(),
    },
    {
      id: '105',
      title: 'The Great Gatsby - First Edition',
      description: 'Rare first edition of F. Scott Fitzgerald\'s masterpiece',
      price: 1200.00,
      category: 'BOOKS',
      condition: 'GOOD',
      status: 'ACTIVE',
      images: ['https://example.com/gatsby-1.jpg'],
      stock: 1,
      sellerId: '1',
      createdAt: new Date('2024-06-01').toISOString(),
    },
    {
      id: '106',
      title: 'Designer Handbag',
      description: 'Authentic Louis Vuitton handbag with certificate',
      price: 1899.99,
      category: 'FASHION',
      condition: 'LIKE_NEW',
      status: 'ACTIVE',
      images: ['https://example.com/bag-1.jpg', 'https://example.com/bag-2.jpg'],
      stock: 2,
      sellerId: '3',
      createdAt: new Date('2024-06-10').toISOString(),
    },
    {
      id: '107',
      title: 'Gaming Mouse - RGB',
      description: 'High precision gaming mouse with customizable RGB lighting',
      price: 79.99,
      category: 'ELECTRONICS',
      condition: 'NEW',
      status: 'ACTIVE',
      images: ['https://example.com/mouse-1.jpg'],
      stock: 30,
      sellerId: '1',
      createdAt: new Date('2024-06-15').toISOString(),
    },
    {
      id: '108',
      title: 'Yoga Mat Premium',
      description: 'Extra thick yoga mat with carrying strap',
      price: 45.99,
      category: 'SPORTS',
      condition: 'NEW',
      status: 'ACTIVE',
      images: ['https://example.com/yoga-1.jpg'],
      stock: 50,
      sellerId: '3',
      createdAt: new Date('2024-06-20').toISOString(),
    },
  ];

  db.orders = [
    {
      id: '201',
      buyerId: '2',
      items: [
        {
          id: '301',
          productId: '103',
          quantity: 2,
          price: 319.98,
        },
        {
          id: '302',
          productId: '107',
          quantity: 1,
          price: 79.99,
        },
      ],
      totalPrice: 399.97,
      status: 'DELIVERED',
      createdAt: new Date('2024-06-25').toISOString(),
    },
    {
      id: '202',
      buyerId: '4',
      items: [
        {
          id: '303',
          productId: '101',
          quantity: 1,
          price: 999.99,
        },
      ],
      totalPrice: 999.99,
      status: 'SHIPPED',
      createdAt: new Date('2024-07-01').toISOString(),
    },
    {
      id: '203',
      buyerId: '2',
      items: [
        {
          id: '304',
          productId: '108',
          quantity: 3,
          price: 137.97,
        },
      ],
      totalPrice: 137.97,
      status: 'PENDING',
      createdAt: new Date('2024-07-05').toISOString(),
    },
  ];

  db.reviews = [
    {
      id: '401',
      productId: '103',
      userId: '2',
      rating: 5,
      comment: 'Amazing shoes! Very comfortable for running.',
      createdAt: new Date('2024-06-28').toISOString(),
    },
    {
      id: '402',
      productId: '107',
      userId: '2',
      rating: 4,
      comment: 'Great mouse, but a bit pricey.',
      createdAt: new Date('2024-06-29').toISOString(),
    },
    {
      id: '403',
      productId: '101',
      userId: '4',
      rating: 5,
      comment: 'Best phone I\'ve ever owned!',
      createdAt: new Date('2024-07-03').toISOString(),
    },
    {
      id: '404',
      productId: '104',
      userId: '4',
      rating: 5,
      comment: 'Perfect sofa for my living room. Excellent quality!',
      createdAt: new Date('2024-07-04').toISOString(),
    },
  ];
};

export const findUserById = (id) => db.users.find(u => u.id === id);
export const findUserByEmail = (email) => db.users.find(u => u.email === email);
export const findProductById = (id) => db.products.find(p => p.id === id);
export const findOrderById = (id) => db.orders.find(o => o.id === id);
export const findReviewById = (id) => db.reviews.find(r => r.id === id);

export const addUser = (user) => {
  const newUser = { ...user, id: uuidv4(), createdAt: new Date().toISOString() };
  db.users.push(newUser);
  return newUser;
};

export const addProduct = (product) => {
  const newProduct = { ...product, id: uuidv4(), createdAt: new Date().toISOString() };
  db.products.push(newProduct);
  return newProduct;
};

export const addOrder = (order) => {
  const newOrder = { ...order, id: uuidv4(), createdAt: new Date().toISOString() };
  db.orders.push(newOrder);
  return newOrder;
};

export const addReview = (review) => {
  const newReview = { ...review, id: uuidv4(), createdAt: new Date().toISOString() };
  db.reviews.push(newReview);
  return newReview;
};

export const deleteProduct = (id) => {
  const index = db.products.findIndex(p => p.id === id);
  if (index > -1) {
    db.products.splice(index, 1);
    db.reviews = db.reviews.filter(r => r.productId !== id);
    return true;
  }
  return false;
};

export const deleteReview = (id) => {
  const index = db.reviews.findIndex(r => r.id === id);
  if (index > -1) {
    db.reviews.splice(index, 1);
    return true;
  }
  return false;
};
