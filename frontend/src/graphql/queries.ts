import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
        phone
        address
        createdAt
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String!, $role: UserRole!) {
    register(email: $email, password: $password, name: $name, role: $role) {
      token
      user {
        id
        email
        name
        role
        phone
        address
        createdAt
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
      phone
      address
      createdAt
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      title
      description
      price
      category
      condition
      status
      images
      stock
      averageRating
      createdAt
      seller {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      price
      category
      condition
      status
      images
      stock
      averageRating
      createdAt
      seller {
        id
        name
        email
      }
      reviews {
        id
        rating
        comment
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_FILTER = gql`
  query GetProductsByFilter($filter: ProductFilter!) {
    productsByFilter(filter: $filter) {
      id
      title
      description
      price
      category
      condition
      status
      images
      stock
      averageRating
      createdAt
      seller {
        id
        name
      }
    }
  }
`;

export const GET_MY_PRODUCTS = gql`
  query GetMyProducts {
    myProducts {
      id
      title
      description
      price
      category
      condition
      status
      images
      stock
      averageRating
      createdAt
    }
  }
`;

export const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      totalPrice
      status
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          title
          images
        }
      }
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) {
      id
      title
      description
      price
      category
      condition
      status
      images
      stock
      createdAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      title
      description
      price
      category
      condition
      status
      images
      stock
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($items: [OrderItemInput!]!) {
    createOrder(items: $items) {
      id
      totalPrice
      status
      createdAt
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation AddReview($input: ReviewInput!) {
    addReview(input: $input) {
      id
      rating
      comment
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($name: String, $phone: String, $address: String) {
    updateUser(name: $name, phone: $phone, address: $address) {
      id
      name
      phone
      address
    }
  }
`;
