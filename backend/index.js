import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';
import { db, findUserById, findUserByEmail, findProductById, findOrderById, findReviewById, addUser, addProduct, addOrder, addReview, deleteProduct, deleteReview } from './mockup.js';
import { generateToken, hashPassword, comparePassword } from './auth.js';
import { validateEmail, validatePassword, validatePrice, validateStock, validateRating } from './validators.js';
import { initializeMockupData } from './mockup.js';


export const resolvers = {
  Query: {
    products: () => {
      return db.products.filter(p => p.status === 'ACTIVE');
    },

    product: (_, { id }) => {
      const product = findProductById(id);
      if (!product) throw new UserInputError('Product not found');
      return product;
    },

    orders: (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return db.orders.filter(o => o.buyerId === user);
    },

    productsByCategory: (_, { category }) => {
      return db.products.filter(p => p.category === category && p.status === 'ACTIVE');
    },

    productsByFilter: (_, { filter }) => {
      let results = db.products.filter(p => p.status === 'ACTIVE');

      if (filter.category) {
        results = results.filter(p => p.category === filter.category);
      }
      if (filter.condition) {
        results = results.filter(p => p.condition === filter.condition);
      }
      if (filter.sellerId) {
        results = results.filter(p => p.sellerId === filter.sellerId);
      }
      if (filter.minPrice !== undefined) {
        results = results.filter(p => p.price >= filter.minPrice);
      }
      if (filter.maxPrice !== undefined) {
        results = results.filter(p => p.price <= filter.maxPrice);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        results = results.filter(p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }

      return results;
    },

    paginatedProducts: (_, { page, limit }) => {
      if (page < 1 || limit < 1) {
        throw new UserInputError('Page and limit must be positive numbers');
      }

      const activeProducts = db.products.filter(p => p.status === 'ACTIVE');
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const products = activeProducts.slice(startIndex, endIndex);
      const totalProducts = activeProducts.length;
      const totalPages = Math.ceil(totalProducts / limit);

      return {
        products,
        totalPages,
        currentPage: page,
        totalProducts,
      };
    },

    user: (_, { id }) => {
      const user = findUserById(id);
      if (!user) throw new UserInputError('User not found');
      return user;
    },

    me: (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return findUserById(user);
    },

    myOrders: (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return db.orders.filter(o => o.buyerId === user);
    },

    myProducts: (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return db.products.filter(p => p.sellerId === user);
    },

    productReviews: (_, { productId }) => {
      return db.reviews.filter(r => r.productId === productId);
    },
  },

  Mutation: {
    register: async (_, { email, password, name, role }) => {
      if (!validateEmail(email)) {
        throw new UserInputError('Invalid email format');
      }
      if (!validatePassword(password)) {
        throw new UserInputError('Password must be at least 6 characters');
      }
      if (!name || name.trim().length === 0) {
        throw new UserInputError('Name is required');
      }

      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new UserInputError('Email already in use');
      }

      const hashedPassword = await hashPassword(password);
      const user = addUser({
        email,
        password: hashedPassword,
        name,
        role,
      });

      const token = generateToken(user.id);
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = findUserByEmail(email);
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const valid = await comparePassword(password, user.password);
      if (!valid) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = generateToken(user.id);
      return { token, user };
    },

    addProduct: (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const currentUser = findUserById(user);
      if (currentUser.role !== 'SELLER' && currentUser.role !== 'ADMIN') {
        throw new ForbiddenError('Only sellers can add products');
      }

      if (!validatePrice(input.price)) {
        throw new UserInputError('Price must be positive');
      }
      if (!validateStock(input.stock)) {
        throw new UserInputError('Stock must be non-negative');
      }

      const product = addProduct({
        ...input,
        sellerId: user,
        status: 'ACTIVE',
      });

      return product;
    },

    addReview: (_, { input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      if (!validateRating(input.rating)) {
        throw new UserInputError('Rating must be between 1 and 5');
      }

      const product = findProductById(input.productId);
      if (!product) throw new UserInputError('Product not found');

      if (product.sellerId === user) {
        throw new ForbiddenError('Cannot review your own product');
      }

      const existingReview = db.reviews.find(
        r => r.productId === input.productId && r.userId === user
      );
      if (existingReview) {
        throw new UserInputError('You have already reviewed this product');
      }

      const review = addReview({
        productId: input.productId,
        userId: user,
        rating: input.rating,
        comment: input.comment,
      });

      return review;
    },

    createOrder: (_, { items }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      if (!items || items.length === 0) {
        throw new UserInputError('Order must contain at least one item');
      }

      const orderItems = [];
      let totalPrice = 0;

      for (const item of items) {
        const product = findProductById(item.productId);
        if (!product) {
          throw new UserInputError(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new UserInputError(`Insufficient stock for ${product.title}`);
        }
        if (product.status !== 'ACTIVE') {
          throw new UserInputError(`Product ${product.title} is not available`);
        }

        const itemPrice = product.price * item.quantity;
        orderItems.push({
          id: uuidv4(),
          productId: product.id,
          quantity: item.quantity,
          price: itemPrice,
        });

        totalPrice += itemPrice;

        product.stock -= item.quantity;
        if (product.stock === 0) {
          product.status = 'SOLD';
        }
      }

      const order = addOrder({
        buyerId: user,
        items: orderItems,
        totalPrice,
        status: 'PENDING',
      });

      return order;
    },

    updateProduct: (_, { id, input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const product = findProductById(id);
      if (!product) throw new UserInputError('Product not found');

      if (product.sellerId !== user) {
        throw new ForbiddenError('You can only update your own products');
      }

      if (input.price && !validatePrice(input.price)) {
        throw new UserInputError('Price must be positive');
      }
      if (input.stock !== undefined && !validateStock(input.stock)) {
        throw new UserInputError('Stock must be non-negative');
      }

      Object.assign(product, input);
      return product;
    },

    updateOrderStatus: (_, { id, status }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const order = findOrderById(id);
      if (!order) throw new UserInputError('Order not found');

      const isBuyer = order.buyerId === user;
      const isSeller = order.items.some(item => {
        const product = findProductById(item.productId);
        return product && product.sellerId === user;
      });

      if (!isBuyer && !isSeller) {
        throw new ForbiddenError('Not authorized to update this order');
      }

      order.status = status;
      return order;
    },

    updateUser: (_, { name, phone, address }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const currentUser = findUserById(user);
      if (name) currentUser.name = name;
      if (phone) currentUser.phone = phone;
      if (address) currentUser.address = address;

      return currentUser;
    },

    deleteProduct: (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const product = findProductById(id);
      if (!product) throw new UserInputError('Product not found');

      if (product.sellerId !== user) {
        throw new ForbiddenError('You can only delete your own products');
      }

      return deleteProduct(id);
    },

    deleteReview: (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const review = findReviewById(id);
      if (!review) throw new UserInputError('Review not found');

      if (review.userId !== user) {
        throw new ForbiddenError('You can only delete your own reviews');
      }

      return deleteReview(id);
    },
  },

User: {
    products: (parent) => {
      return db.products.filter(p => p.sellerId === parent.id);
    },
    orders: (parent) => {
      return db.orders.filter(o => o.buyerId === parent.id);
    },
    reviews: (parent) => {
      return db.reviews.filter(r => r.userId === parent.id);
    },
  },

  Product: {
    seller: (parent) => {
      return findUserById(parent.sellerId);
    },
    reviews: (parent) => {
      return db.reviews.filter(r => r.productId === parent.id);
    },
    averageRating: (parent) => {
      const reviews = db.reviews.filter(r => r.productId === parent.id);
      if (reviews.length === 0) return null;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / reviews.length;
    },
  },

  Order: {
    buyer: (parent) => {
      return findUserById(parent.buyerId);
    },
  },

  OrderItem: {
    product: (parent) => {
      return findProductById(parent.productId);
    },
  },

  Review: {
    product: (parent) => {
      return findProductById(parent.productId);
    },
    user: (parent) => {
      return findUserById(parent.userId);
    },
  },
};

initializeMockupData().then(() => {
  console.log('✅ Mockup data initialized');
});