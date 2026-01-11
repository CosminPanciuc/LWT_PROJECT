import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { GET_PRODUCTS_BY_FILTER } from '../graphql/queries';
import type { Product, ProductCategory, ProductCondition } from '../types';

export default function Products() {
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [condition, setCondition] = useState<ProductCondition | ''>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');

  const filter: any = {};
  if (category) filter.category = category;
  if (condition) filter.condition = condition;
  if (minPrice) filter.minPrice = parseFloat(minPrice);
  if (maxPrice) filter.maxPrice = parseFloat(maxPrice);
  if (search) filter.search = search;

  const { data, loading, error } = useQuery<{ productsByFilter: Product[] }>(GET_PRODUCTS_BY_FILTER, {
    variables: { filter },
  });

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;

  const products: Product[] = data?.productsByFilter || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory | '')}
          >
            <option value="">All Categories</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="FASHION">Fashion</option>
            <option value="HOME">Home</option>
            <option value="BOOKS">Books</option>
            <option value="SPORTS">Sports</option>
            <option value="OTHER">Other</option>
          </select>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={condition}
            onChange={(e) => setCondition(e.target.value as ProductCondition | '')}
          >
            <option value="">All Conditions</option>
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
          </select>
          <input
            type="number"
            placeholder="Min Price"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-4xl">📦</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{product.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              <p className="text-sm text-gray-500">{product.condition}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                {product.averageRating && (
                  <span className="text-sm text-yellow-600">
                    ⭐ {product.averageRating.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Stock: {product.stock}</p>
              <p className="text-xs text-gray-500">by {product.seller.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}
