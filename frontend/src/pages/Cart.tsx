import { useQuery, useMutation } from '@apollo/client/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GET_PRODUCT, CREATE_ORDER } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: () => {
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // Fetch product details for cart items
  const cartWithProducts = items.map((item) => {
    const { data } = useQuery<{ product: Product | undefined }>(GET_PRODUCT, {
      variables: { id: item.productId },
    });
    return {
      ...item,
      product: data?.product,
    };
  });

  const total = cartWithProducts.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createOrder({
        variables: {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartWithProducts.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div key={item.productId} className="bg-white p-6 rounded-lg shadow flex items-center">
                <div className="w-24 h-24 bg-gray-200 rounded flex-shrink-0 mr-4 flex items-center justify-center">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">📦</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">${product.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-1 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
