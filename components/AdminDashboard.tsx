'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import Papa from 'papaparse';

interface Order {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: Array<{
    // Normalized fields (when API already flattens items)
    productId?: string;
    productName?: string;
    quantity: number;
    price?: number;
    size?: string;
    sku?: string;
    // Raw cart item fallback shape
    product?: {
      id: string;
      title: string;
      price: number;
      salePrice?: number;
      sku?: string;
    };
    selectedSize?: string;
  }>;
  status: string;
  createdAt: string;
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }>;
  monthlySales: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch analytics
      const analyticsRes = await fetch('/api/analytics');
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      // Fetch orders
      const ordersRes = await fetch('/api/admin/orders');
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getItemName = (item: any): string => {
    return item.productName || item.product?.title || 'Unknown';
  };

  const getItemSku = (item: any): string => {
    return item.sku || item.product?.sku || item.productId || '—';
  };

  const getItemSize = (item: any): string => {
    return item.size || item.selectedSize || 'N/A';
  };

  const getItemPrice = (item: any): number => {
    return (
      item.price ??
      item.product?.salePrice ??
      item.product?.price ??
      0
    );
  };

  const makeAddressLine = (order: Order): string => {
    const a = order.customer;
    return `${a.address}, ${a.city}, ${a.state} - ${a.pincode}`;
  };

  const flattenOrders = (ordersToExport: Order[]) => {
    const rows: Array<Record<string, string | number>> = [];
    for (const order of ordersToExport) {
      for (const item of order.items) {
        const price = getItemPrice(item);
        rows.push({
          'Order ID': order.id,
          'Date Time': new Date(order.createdAt).toLocaleString(),
          'Status': order.status,
          'Customer Name': `${order.customer.firstName} ${order.customer.lastName}`,
          'Email': order.customer.email,
          'Phone': order.customer.phone,
          'Address': order.customer.address,
          'City': order.customer.city,
          'State': order.customer.state,
          'Pincode': order.customer.pincode,
          'Country': order.customer.country,
          'Product Name': getItemName(item),
          'SKU': getItemSku(item),
          'Size': getItemSize(item),
          'Quantity': item.quantity,
          'Price': price,
          'Line Total': price * item.quantity,
          'Order Amount': order.amount,
        });
      }
    }
    return rows;
  };

  const exportToExcel = () => {
    try {
      const rows = flattenOrders(orders);
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      link.href = url;
      link.setAttribute('download', `orders-export-${ts}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  if (loading) return <div className="container-custom py-10">Loading admin dashboard...</div>;
  if (user?.role !== 'admin') return <div className="container-custom py-10">Access denied</div>;

  return (
    <div className="container-custom py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome, {user?.name}
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="text-gray-500 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-green-600">₹{analytics.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-500 mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-blue-600">{analytics.totalOrders}</div>
          </div>
          <div className="card p-6">
            <div className="text-gray-500 mb-2">Average Order Value</div>
            <div className="text-3xl font-bold text-purple-600">₹{analytics.averageOrderValue.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <button onClick={exportToExcel} className="btn-outline text-sm px-3 py-1">Export to Excel</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Order ID</th>
                <th className="text-left py-2">Customer</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Phone</th>
                <th className="text-left py-2">Delivery Address</th>
                <th className="text-left py-2">Items (SKU & Size)</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Date & Time</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-mono text-xs">{order.id}</td>
                  <td className="py-2">{order.customer.firstName} {order.customer.lastName}</td>
                  <td className="py-2">{order.customer.email}</td>
                  <td className="py-2">{order.customer.phone}</td>
                  <td className="py-2 max-w-xs truncate" title={makeAddressLine(order)}>
                    {makeAddressLine(order)}
                  </td>
                  <td className="py-2 max-w-sm truncate" title={order.items.map((it) => `${getItemSku(it)} (${getItemSize(it)}) x ${it.quantity}`).join(', ')}>
                    {order.items.map((it) => `${getItemSku(it)} (${getItemSize(it)}) x ${it.quantity}`).join(', ')}
                  </td>
                  <td className="py-2">₹{order.amount.toLocaleString()}</td>
                  <td className="py-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs border rounded px-2 py-1"
                    >
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-2">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="py-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div>
                <h4 className="font-semibold mb-3">Customer Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</div>
                  <div><strong>Email:</strong> {selectedOrder.customer.email}</div>
                  <div><strong>Phone:</strong> {selectedOrder.customer.phone}</div>
                  <div><strong>Address:</strong> {selectedOrder.customer.address}</div>
                  <div><strong>City:</strong> {selectedOrder.customer.city}</div>
                  <div><strong>State:</strong> {selectedOrder.customer.state}</div>
                  <div><strong>Pincode:</strong> {selectedOrder.customer.pincode}</div>
                  <div><strong>Country:</strong> {selectedOrder.customer.country}</div>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h4 className="font-semibold mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Order ID:</strong> {selectedOrder.id}</div>
                  <div><strong>Razorpay Order ID:</strong> {selectedOrder.razorpay_order_id}</div>
                  <div><strong>Payment ID:</strong> {selectedOrder.razorpay_payment_id}</div>
                  <div><strong>Amount:</strong> ₹{selectedOrder.amount.toLocaleString()}</div>
                  <div><strong>Status:</strong> {selectedOrder.status}</div>
                  <div><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Order Items (with SKU and size normalization) */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Order Items & SKU Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Product</th>
                      <th className="text-left py-2">SKU</th>
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Quantity</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{getItemName(item)}</td>
                        <td className="py-2 font-mono text-xs">{getItemSku(item)}</td>
                        <td className="py-2">{getItemSize(item)}</td>
                        <td className="py-2">{item.quantity}</td>
                        <td className="py-2">₹{getItemPrice(item).toLocaleString()}</td>
                        <td className="py-2">₹{(getItemPrice(item) * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h4 className="font-semibold mb-2">Payment Information</h4>
              <div className="text-sm space-y-1">
                <div><strong>Payment Method:</strong> Razorpay</div>
                <div><strong>Transaction ID:</strong> {selectedOrder.razorpay_payment_id}</div>
                <div><strong>Order ID:</strong> {selectedOrder.razorpay_order_id}</div>
                <div><strong>Amount Paid:</strong> ₹{selectedOrder.amount.toLocaleString()}</div>
                <div><strong>Payment Status:</strong> <span className="text-green-600">Completed</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Products */}
      {analytics && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Product</th>
                  <th className="text-left py-2">Sales</th>
                  <th className="text-left py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topSellingProducts.map((product) => (
                  <tr key={product.productId} className="border-b">
                    <td className="py-2">{product.productName}</td>
                    <td className="py-2">{product.sales}</td>
                    <td className="py-2">₹{product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}