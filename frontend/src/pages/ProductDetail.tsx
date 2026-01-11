import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PRODUCT, ADD_REVIEW } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id },
  });

  const [addReview] = useMutation(ADD_REVIEW, {
    onCompleted: () => {
      setShowReviewForm(false);
      setComment('');
      setRating(5);
      refetch();
    },
  });

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;

  const product = data?.product;

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product.id, quantity);
    alert('Added to cart!');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addReview({
        variables: {
          input: {
            productId: product.id,
            rating,
            comment,
          },
        },
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canReview = user && user.id !== product.seller.id && !product.reviews.some((r) => r.user.id === user.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center mb-4">
            {product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-6xl">📦</span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((img, idx) => (
                <div key={idx} className="bg-gray-200 rounded h-20 flex items-center justify-center">
                  <img src={img} alt={`${product.title} ${idx + 2}`} className="h-full w-full object-cover rounded" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            {product.averageRating && (
              <span className="text-lg text-yellow-600">⭐ {product.averageRating.toFixed(1)}</span>
            )}
          </div>

          <div className="mb-6 space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Condition:</span> {product.condition}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Stock:</span> {product.stock} available
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Seller:</span> {product.seller.name}
            </p>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {product.stock > 0 && product.status === 'ACTIVE' && (
            <div className="flex items-center space-x-4 mb-6">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-4 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold"
              >
                Add to Cart
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800 font-semibold">Out of Stock</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {canReview && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Write a Review
            </button>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Good</option>
                <option value={3}>3 - Average</option>
                <option value={2}>2 - Poor</option>
                <option value={1}>1 - Terrible</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Submit Review
            </button>
          </form>
        )}

        <div className="space-y-4">
          {product.reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{review.user.name}</span>
                <span className="text-yellow-600">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {product.reviews.length === 0 && (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </div>
    </div>
  );
}
