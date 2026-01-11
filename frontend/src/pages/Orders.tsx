import { useQuery } from '@apollo/client/react';
import { GET_MY_ORDERS } from '../graphql/queries';
import type { Order } from '../types';

export default function Orders() {
  const { data, loading, error } = useQuery<{ myOrders: Order[] }>(GET_MY_ORDERS);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;

  const orders: Order[] = data?.myOrders || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order #{order.id.slice(0, 8)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.status === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'SHIPPED'
                      ? 'bg-purple-100 text-purple-800'
                      : order.status === 'DELIVERED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="border-t pt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex-shrink-0 flex items-center justify-center">
                        {item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="h-full w-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400 text-2xl">📦</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.product.title}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold text-blue-600">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
