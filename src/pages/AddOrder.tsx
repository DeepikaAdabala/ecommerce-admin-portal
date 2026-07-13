import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addOrder } from '../features/orders/orderActions';
import type { AppDispatch } from '../store';
import type { OrderStatus, PaymentStatus } from '../types/ecommerce';

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const paymentStatusOptions = ['Paid', 'Pending', 'Failed', 'Refunded'];

interface OrderFormState {
  customerName: string;
  total: string;
  quantity: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

function AddOrder() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderFormState>({
    customerName: '',
    total: '',
    quantity: 1,
    status: 'Pending',
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setOrder((prev) => ({
      ...prev,
      [name as keyof OrderFormState]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await dispatch(addOrder({
        customerName: order.customerName,
        total: Number(order.total),
        quantity: Number(order.quantity),
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: new Date(order.createdAt).toISOString(),
      })).unwrap();

      navigate('/orders', { 
        state: { 
          message: 'Order created successfully',
          type: 'success'
        } 
      });
    } catch (err) {
      setError('Failed to add order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>Add Order</h2>
          <p className="text-muted">Create a new order record for fulfillment tracking.</p>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger rounded-0 mb-4" style={{ borderLeft: '4px solid #dc3545' }}>
          {error}
        </div>
      )}
      
      <div className="card border-0 shadow-sm p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Customer Name</label>
              <input 
                name="customerName" 
                value={order.customerName} 
                onChange={handleChange} 
                className="form-control rounded-0" 
                required 
                disabled={loading}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Total (Rs)</label>
              <input 
                name="total" 
                type="number" 
                step="0.01"
                value={order.total} 
                onChange={handleChange} 
                className="form-control rounded-0" 
                required 
                disabled={loading}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Quantity</label>
              <input
                name="quantity"
                type="number"
                min="1"
                value={order.quantity}
                onChange={handleChange}
                className="form-control rounded-0"
                required
                disabled={loading}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Status</label>
              <select 
                name="status" 
                value={order.status} 
                onChange={handleChange} 
                className="form-select rounded-0"
                disabled={loading}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Payment Status</label>
              <select
                name="paymentStatus"
                value={order.paymentStatus}
                onChange={handleChange}
                className="form-select rounded-0"
                disabled={loading}
              >
                {paymentStatusOptions.map((paymentStatus) => (
                  <option key={paymentStatus} value={paymentStatus}>{paymentStatus}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">Order Date</label>
              <input 
                name="createdAt" 
                type="datetime-local" 
                value={order.createdAt} 
                onChange={handleChange} 
                className="form-control rounded-0" 
                required 
                disabled={loading}
              />
            </div>
          </div>
          <div className="mt-4">
            <button 
              type="submit" 
              className="btn btn-primary rounded-0 px-4 me-2" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Order'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary rounded-0 px-4" 
              onClick={() => navigate('/orders')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrder;