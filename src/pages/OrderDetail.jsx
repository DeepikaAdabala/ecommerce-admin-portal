import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../features/orders/ordersSlice';

function OrderDetail() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchOrders());
    }
  }, [dispatch, items.length]);

  const order = items.find((item) => item.id === orderId);

  if (loading) {
    return (
      <div className="alert alert-info rounded-0" style={{ borderLeft: '4px solid #17a2b8' }}>
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger rounded-0" style={{ borderLeft: '4px solid #dc3545' }}>
        {error}
      </div>
    );
  }

  if (!order) {
    return <div className="alert alert-warning rounded-0">Order details not found.</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>Order {order.id}</h2>
          {/* <p className="text-muted mb-1">Order detail view</p> */}
          <p className="mb-0">
            <strong>Customer:</strong> {order.customerName}
          </p>
        </div>
        {/* <Link to="/orders" className="btn btn-outline-secondary rounded-0">
          Back to orders
        </Link> */}
      </div>

      <div className="card border-0 shadow-sm p-4">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="fw-semibold text-muted mb-1">Product Ordered</div>
            <div>{order.productTitle || 'Product unavailable'}</div>
          </div>
          <div className="col-12 col-md-6">
            <div className="fw-semibold text-muted mb-1">Quantity</div>
            <div>{order.quantity || 1}</div>
          </div>
          <div className="col-12 col-md-6">
            <div className="fw-semibold text-muted mb-1">Order Status</div>
            <div>{order.status}</div>
          </div>
          <div className="col-12 col-md-6">
            <div className="fw-semibold text-muted mb-1">Payment Status</div>
            <div>{order.paymentStatus || 'Pending'}</div>
          </div>
          <div className="col-12 col-md-6">
            <div className="fw-semibold text-muted mb-1">Order Total</div>
            <div>Rs{order.total.toFixed(2)}</div>
          </div>
          <div className="col-12 col-md-6">
            <div className="fw-semibold text-muted mb-1">Order Date</div>
            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
