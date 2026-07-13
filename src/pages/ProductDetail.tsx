import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProducts, updateProduct, deleteProduct } from '../features/products/productsSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { VALIDATION_PATTERNS } from '../constants/theme';
import type { RootState, AppDispatch } from '../store';
import type { Product, ProductStatus } from '../types/ecommerce';

type AlertType = 'success' | 'danger';
interface ColorfulAlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

// Colorful Alert Component - Single Line
const ColorfulAlert = ({ type, message, onClose }: ColorfulAlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const alertConfig: Record<AlertType, { bgColor: string; borderColor: string; textColor: string; icon: string; iconBg: string }> = {
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

interface ConfirmationModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  productTitle: string;
}

// Official Confirmation Modal Component for Product
const ConfirmationModal = ({ show, onConfirm, onCancel, productTitle }: ConfirmationModalProps) => {
  if (!show) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100" style={{ 
      zIndex: 1050, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="bg-white" style={{ 
        width: '450px',
        maxWidth: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Modal Header */}
        <div style={{ 
          padding: '20px 24px',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa'
        }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: 600,
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: '#1a1a1a'
          }}>
            Confirm Deletion
          </h4>
        </div>
        
        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            fontSize: '14px',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: '#333'
          }}>
            Are you sure you want to delete product <strong>"{productTitle}"</strong>?
          </p>
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            backgroundColor: '#fff3cd',
            borderLeft: '3px solid #ffc107'
          }}>
            <span style={{ fontSize: '13px', color: '#856404' }}>
              ⚠ This action cannot be undone.
            </span>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div style={{ 
          padding: '16px 24px',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onCancel}
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
              (e.target as HTMLButtonElement).style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'white';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 20px',
              backgroundColor: '#dc3545',
              border: '1px solid #dc3545',
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'Segoe UI', Arial, sans-serif",
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#c82333';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#dc3545';
            }}
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function ProductDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { items, loading, error } = useAppSelector((state) => state.products);
  const product = useMemo(() => items.find((item: Product) => item.id === productId), [items, productId]);
  const [editable, setEditable] = useState(false);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [form, setForm] = useState<{ title: string; sku: string; category: string; price: string; inventory: string; variations: string; description: string }>({
    title: '',
    sku: '',
    category: 'Accessories',
    price: '',
    inventory: '',
    variations: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!items.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title,
        sku: product.sku,
        category: product.category || 'Accessories',
        price: product.price.toString(),
        inventory: product.inventory.toString(),
        variations: product.variations.join(', '),
        description: product.description,
      });
    }
  }, [product]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = 'Product title is required.';
    if (!VALIDATION_PATTERNS.sku.test(form.sku)) nextErrors.sku = 'SKU must be uppercase and 4-16 chars.';
    if (!VALIDATION_PATTERNS.price.test(form.price)) nextErrors.price = 'Enter a valid non-negative price.';
    if (!VALIDATION_PATTERNS.inventory.test(form.inventory)) nextErrors.inventory = 'Inventory must be numeric.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((state) => ({ ...state, [name]: value }));
  };

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    await dispatch(
      updateProduct({
        id: productId ?? '',
        payload: {
          title: form.title,
          sku: form.sku,
          category: form.category,
          price: Number(form.price),
          inventory: Number(form.inventory),
          variations: form.variations.split(',').map((item) => item.trim()).filter(Boolean),
          description: form.description,
        },
      }),
    );
    setAlert({ type: 'success', message: 'Product changes updated successfully' });
    setEditable(false);
    dispatch(fetchProducts());
  };

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteProduct(productId ?? ''));
    setShowConfirmModal(false);
    navigate('/products', { state: { message: 'Product deleted successfully', type: 'success' } });
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  if (loading && !product) {
    return <div className="alert alert-info">Loading product details...</div>;
  }

  if (!product) {
    return <div className="alert alert-warning">Product not found. Please select a product from the catalog.</div>;
  }

  return (
    <div className="page-product-detail">
      {alert && (
        <ColorfulAlert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      {/* Official Confirmation Modal */}
      <ConfirmationModal 
        show={showConfirmModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        productTitle={product.title}
      />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>{product.title}</h2>
          <p className="text-muted">Manage product details, pricing, and inventory.</p>
        </div>
        <div className="d-flex gap-2">
          <Button type="button" variant="outline-secondary" onClick={() => setEditable((state) => !state)}>
            {editable ? 'Cancel' : 'Edit'}
          </Button>
          <Button type="button" variant="danger" onClick={handleDeleteClick}>
            Delete
          </Button>
        </div>
      </div>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div>
              <span className="badge bg-success">{product.status}</span>
              <p className="text-muted mt-3 mb-0">Created at {new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-end">
              <h3 className="mb-1">Rs{product.price.toFixed(2)}</h3>
              <p className="text-muted mb-0">Inventory {product.inventory}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form noValidate onSubmit={onSave}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <Input label="Product title" name="title" value={form.title} onChange={onChange} error={errors.title} disabled={!editable} />
              </div>
              <div className="col-12 col-md-6">
                <Input label="SKU code" name="sku" value={form.sku} onChange={onChange} error={errors.sku} disabled={!editable} />
              </div>
              <div className="col-12 col-md-4">
                <Input label="Price" name="price" value={form.price} onChange={onChange} error={errors.price} disabled={!editable} />
              </div>
              <div className="col-12 col-md-4">
                <Input label="Inventory" name="inventory" value={form.inventory} onChange={onChange} error={errors.inventory} disabled={!editable} />
              </div>
              <div className="col-12 col-md-4">
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={onChange} disabled={!editable}>
                    <option>Accessories</option>
                    <option>Apparel</option>
                    <option>Electronics</option>
                    <option>Home</option>
                    <option>Office</option>
                    <option>Fitness</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <Input label="Variations" name="variations" value={form.variations} onChange={onChange} disabled={!editable} />
              </div>
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">Product description</label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows={5}
                    disabled={!editable}
                  />
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
              </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {editable && (
              <div className="d-flex justify-content-end mt-3">
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;