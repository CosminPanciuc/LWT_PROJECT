import { gql } from 'apollo-server';

const typeDefs = gql`
  # Enum Types
  enum UserRole {
    BUYER
    SELLER
    ADMIN
  }

  enum ProductCategory {
    ELECTRONICS
    FASHION
    HOME
    BOOKS
    SPORTS
    OTHER
  }

  enum ProductCondition {
    NEW
    LIKE_NEW
    GOOD
    FAIR
  }

  enum ProductStatus {
    ACTIVE
    SOLD
    INACTIVE
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    SHIPPED
    DELIVERED
    CANCELLED
  }

  # Object Types
  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    phone: String
    address: String
    products: [Product!]!
    orders: [Order!]!
    reviews: [Review!]!
    createdAt: String!
  }

  type Product {
    id: ID!
    title: String!
    description: String!
    price: Float!
    category: ProductCategory!
    condition: ProductCondition!
    status: ProductStatus!
    images: [String!]!
    stock: Int!
    seller: User!
    reviews: [Review!]!
    averageRating: Float
    createdAt: String!
  }

  type Order {
    id: ID!
    buyer: User!
    items: [OrderItem!]!
    totalPrice: Float!
    status: OrderStatus!
    createdAt: String!
  }

  type OrderItem {
    id: ID!
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Review {
    id: ID!
    product: Product!
    user: User!
    rating: Int!
    comment: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type PaginatedProducts {
    products: [Product!]!
    totalPages: Int!
    currentPage: Int!
    totalProducts: Int!
  }

  # Input Types
  input ProductInput {
    title: String!
    description: String!
    price: Float!
    category: ProductCategory!
    condition: ProductCondition!
    images: [String!]!
    stock: Int!
  }

  input ReviewInput {
    productId: ID!
    rating: Int!
    comment: String!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input ProductFilter {
    category: ProductCategory
    minPrice: Float
    maxPrice: Float
    condition: ProductCondition
    sellerId: ID
    search: String
  }

  # Queries
  type Query {
    # List of objects
    products: [Product!]!
    
    # Filtered object by argument
    product(id: ID!): Product!
    
    # List containing nested objects
    orders: [Order!]!
    
    # Filtered list
    productsByCategory(category: ProductCategory!): [Product!]!
    productsByFilter(filter: ProductFilter!): [Product!]!
    
    # Paginated list
    paginatedProducts(page: Int!, limit: Int!): PaginatedProducts!
    
    # Additional queries
    user(id: ID!): User!
    me: User!
    myOrders: [Order!]!
    myProducts: [Product!]!
    productReviews(productId: ID!): [Review!]!
  }

  # Mutations
  type Mutation {
    # Authentication
    register(email: String!, password: String!, name: String!, role: UserRole!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # Add entities
    addProduct(input: ProductInput!): Product!
    addReview(input: ReviewInput!): Review!
    createOrder(items: [OrderItemInput!]!): Order!
    
    # Update entities
    updateProduct(id: ID!, input: ProductInput!): Product!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    updateUser(name: String, phone: String, address: String): User!
    
    # Delete entities
    deleteProduct(id: ID!): Boolean!
    deleteReview(id: ID!): Boolean!
  }
`;

export default typeDefs;