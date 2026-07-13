import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../features/orders/ordersSlice';
import type { RootState, AppDispatch } from '../store';
import type { Order, PaymentStatus, OrderStatus } from '../types/ecommerce';

const statusClass: Record<OrderStatus, string> = {
  Pending: 'badge bg-warning text-dark',
  Processing: 'badge bg-info text-dark',
  Shipped: 'badge bg-primary',
  Delivered: 'badge bg-success',
  Cancelled: 'badge bg-danger',
  Refunded: 'badge bg-secondary',
  Unknown: 'badge bg-secondary',
};

const paymentStatusClass: Record<PaymentStatus, string> = {
  Paid: 'badge bg-success',
  Pending: 'badge bg-warning text-dark',
  Failed: 'badge bg-danger',
  Refunded: 'badge bg-secondary',
  Unknown: 'badge bg-secondary',
};

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      pending: items.filter((order: Order) => order.status === 'Pending').length,
      delivered: items.filter((order: Order) => order.status === 'Delivered').length,
      shipped: items.filter((order: Order) => order.status === 'Shipped').length,
      paid: items.filter((order: Order) => order.paymentStatus === 'Paid').length,
    };
  }, [items]);

  return (
    <div className="page-orders">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="mb-1">Orders</h2>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3 summary-card summary-card-total">
            <div className="text-uppercase text-muted small">Total orders</div>
            <div className="h4 mb-0 mt-2">{summary.total}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3 summary-card summary-card-pending">
            <div className="text-uppercase text-muted small">Pending</div>
            <div className="h4 mb-0 mt-2">{summary.pending}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3 summary-card summary-card-shipped">
            <div className="text-uppercase text-muted small">Shipped</div>
            <div className="h4 mb-0 mt-2">{summary.shipped}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3 summary-card summary-card-delivered">
            <div className="text-uppercase text-muted small">Delivered</div>
            <div className="h4 mb-0 mt-2">{summary.delivered}</div>
          </div>
        </div>
        {/* <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 p-3 summary-card summary-card-paid">
            <div className="text-uppercase text-muted small">Paid</div>
            <div className="h4 mb-0 mt-2">{summary.paid}</div>
          </div>
        </div> */}
      </div>

      {loading && (
        <div className="alert alert-info rounded-0" style={{ borderLeft: '4px solid #17a2b8' }}>
          Loading orders...
        </div>
      )}

      {error && (
        <div className="alert alert-danger rounded-0" style={{ borderLeft: '4px solid #dc3545' }}>
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header border-bottom py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">Order list</h5>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="text-muted small text-uppercase">
              <tr>
                <th className="py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Product</th>
                <th className="py-3">Qty</th>
                <th className="py-3">Total</th>
                <th className="py-3">Status</th>
              <th className="py-3">Payment</th>
              <th className="py-3">Date</th>
            </tr>
            </thead>
            <tbody>
              {items.map((order: Order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/orders/${order.id}`} className="text-primary fw-semibold text-decoration-none">
                      {order.id}
                    </Link>
                  </td>
                  <td>{order.customerName}</td>
                  <td className="text-muted">{order.productTitle || 'Product unavailable'}</td>
                  <td>{order.quantity || 1}</td>
                  <td>{order.total != null ? `₹ ${order.total.toFixed(2)}` : 'N/A'}</td>
                  <td>
                    <span className={statusClass[order.status] || 'badge bg-secondary rounded-pill'}>{order.status || 'Unknown'}</span>
                  </td>
                  <td>
                    <span className={paymentStatusClass[order.paymentStatus] || 'badge bg-secondary'}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                  </td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}</td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
