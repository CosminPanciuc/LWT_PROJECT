import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Buy and sell quality products with ease
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold"
            >
              Browse Products
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-md border-2 border-blue-600 hover:bg-blue-50 text-lg font-semibold"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Shopping</h3>
            <p className="text-gray-600">
              Browse thousands of products across multiple categories
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sell Your Items</h3>
            <p className="text-gray-600">
              List your products and reach customers instantly
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted Reviews</h3>
            <p className="text-gray-600">
              Read and write reviews to make informed decisions
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Electronics', emoji: '💻' },
            { name: 'Fashion', emoji: '👕' },
            { name: 'Home', emoji: '🏠' },
            { name: 'Books', emoji: '📚' },
            { name: 'Sports', emoji: '⚽' },
            { name: 'Other', emoji: '🎁' },
          ].map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${category.name.toUpperCase()}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-2">{category.emoji}</div>
              <div className="font-semibold text-gray-900">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
