import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, createCustomer } from '../features/customers/customersSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const initialForm = {
  name: '',
  email: '',
  lastOrder: '',
  lifetimeValue: '',
};

const getCustomerTierByLifetimeValue = (value) => {
  const amount = Number(value) || 0;
  if (amount > 3000) return 'Platinum';
  if (amount > 1500) return 'Gold';
  if (amount > 500) return 'Silver';
  return 'Bronze';
};

// Colorful Alert Component - Single Line
const ColorfulAlert = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const alertConfig = {
    success: {
      bgColor: '#d4edda',
      borderColor: '#28a745',
      textColor: '#155724',
      icon: '✓',
      iconBg: '#28a745',
    },
    danger: {
      bgColor: '#f8d7da',
      borderColor: '#dc3545',
      textColor: '#721c24',
      icon: '✗',
      iconBg: '#dc3545',
    },
  };

  const config = alertConfig[type];

  return (
    <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1080, minWidth: '350px', maxWidth: '500px' }}>
      <div 
        className="shadow-lg d-flex align-items-center justify-content-between"
        style={{ 
          backgroundColor: config.bgColor,
          borderLeft: `4px solid ${config.borderColor}`,
          padding: '12px 20px',
          borderRadius: '8px',
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              backgroundColor: config.iconBg,
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            {config.icon}
          </div>
          <span style={{ color: config.textColor, fontSize: '14px', fontWeight: 500 }}>
            {message}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: config.textColor,
            opacity: 0.6,
            padding: '0',
            marginLeft: '15px',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Customer Form Modal Popup Component
const CustomerFormModal = ({ show, onClose, onSubmit, form, onChange, errors, isSubmitting }) => {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ 
      zIndex: 1050, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflowY: 'auto',
      padding: '20px'
    }}>
      <div className="bg-white" style={{ 
        width: '550px',
        maxWidth: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Modal Header */}
        <div style={{ 
          padding: '20px 24px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: 600,
              fontFamily: "'Segoe UI', Arial, sans-serif",
              color: '#1a1a1a'
            }}>
              {editingId ? 'Edit Customer' : 'Add New Customer'}
            </h4>
            <p style={{ 
              margin: '5px 0 0 0', 
              fontSize: '13px',
              color: '#666',
              fontFamily: "'Segoe UI', Arial, sans-serif"
            }}>
              {editingId ? 'Update customer details' : 'Enter customer information'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.color = '#333'}
            onMouseLeave={(e) => e.target.style.color = '#999'}
          >
            ×
          </button>
        </div>
        
        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          <form noValidate onSubmit={onSubmit}>
            <Input 
              label="Name" 
              name="name" 
              value={form.name} 
              onChange={onChange} 
              error={errors.name}
              disabled={isSubmitting}
            />
            <Input 
              label="Email" 
              name="email" 
              type="email"
              value={form.email} 
              onChange={onChange} 
              error={errors.email}
              disabled={isSubmitting}
            />
            <Input 
              label="Last Order Date" 
              name="lastOrder" 
              type="date"
              value={form.lastOrder} 
              onChange={onChange} 
              placeholder="YYYY-MM-DD" 
              error={errors.lastOrder}
              disabled={isSubmitting}
            />
            <Input 
              label="Lifetime Value ($)" 
              name="lifetimeValue" 
              type="number"
              value={form.lifetimeValue} 
              onChange={onChange} 
              error={errors.lifetimeValue}
              disabled={isSubmitting}
              placeholder="0"
            />
            
            {/* Modal Footer */}
            <div style={{ 
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'Segoe UI', Arial, sans-serif",
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '8px 24px',
                  backgroundColor: '#007bff',
                  border: '1px solid #007bff',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: "'Segoe UI', Arial, sans-serif",
                  transition: 'all 0.2s',
                  opacity: isSubmitting ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.target.style.backgroundColor = '#0056b3';
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.target.style.backgroundColor = '#007bff';
                }}
              >
                {isSubmitting ? 'Saving...' : 'Add Customer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function Customers() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.customers);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Customer name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email is required.';
    if (!form.lastOrder.trim()) nextErrors.lastOrder = 'Last order date is required.';
    if (!/^[0-9]+$/.test(form.lifetimeValue)) nextErrors.lifetimeValue = 'Enter a valid lifetime value.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    const payload = {
      name: form.name,
      email: form.email,
      tier: getCustomerTierByLifetimeValue(form.lifetimeValue),
      lastOrder: form.lastOrder,
      lifetimeValue: Number(form.lifetimeValue),
    };
    
    try {
      await dispatch(createCustomer(payload)).unwrap();
      setAlert({ type: 'success', message: 'Customer added successfully' });
      setShowFormModal(false);
      resetForm();
      await dispatch(fetchCustomers());
    } catch (err) {
      setAlert({ type: 'danger', message: 'Failed to add customer' });
    } finally {
      setIsSubmitting(false);
    }
  };


  const onOpenCreate = () => {
    resetForm();
    setShowFormModal(true);
  };

  const onCloseFormModal = () => {
    setShowFormModal(false);
    resetForm();
  };

  return (
    <div>
      {alert && (
        <ColorfulAlert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      <CustomerFormModal 
        show={showFormModal}
        onClose={onCloseFormModal}
        onSubmit={onSubmit}
        form={form}
        onChange={onChange}
        errors={errors}
        isSubmitting={isSubmitting}
      />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>Customers</h2>
        </div>
        {/* <Button type="button" variant="primary" onClick={onOpenCreate}>
          Add new customer
        </Button> */}
      </div>
      
      {loading && (
        <div className="alert alert-info rounded-0" style={{ borderLeft: '4px solid #17a2b8' }}>
          Loading customers...
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger rounded-0" style={{ borderLeft: '4px solid #dc3545' }}>
          {error}
        </div>
      )}
      
      <div className="table-responsive shadow-sm rounded bg-white mb-4">
        <table className="table mb-0 align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tier</th>
              <th>Last order</th>
              <th>Lifetime value</th>
            </tr>
          </thead>
          <tbody>
            {items.map((customer) => (
              <tr key={customer.id} className={`customer-row tier-${customer.tier.toLowerCase()}`}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>
                  <span className={`badge customer-tier-badge tier-${customer.tier.toLowerCase()}`}>
                    {customer.tier}
                  </span>
                </td>
                <td>{customer.lastOrder}</td>
                <td>Rs{customer.lifetimeValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;