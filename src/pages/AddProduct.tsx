import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { createProduct } from '../features/products/productsSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { VALIDATION_PATTERNS } from '../constants/theme';
import type { RootState, AppDispatch } from '../store';

interface ProductFormState {
  title: string;
  sku: string;
  category: string;
  price: string;
  inventory: string;
  variations: string;
  description: string;
}

const initialForm: ProductFormState = {
  title: '',
  sku: '',
  category: 'Accessories',
  price: '',
  inventory: '',
  variations: '',
  description: '',
};

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function AddProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useAppSelector((state) => state.products);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = 'Product title is required.';
    if (!VALIDATION_PATTERNS.sku.test(form.sku)) nextErrors.sku = 'SKU must be uppercase and 4-16 chars.';
    if (!VALIDATION_PATTERNS.price.test(form.price)) nextErrors.price = 'Enter a valid non-negative price.';
    if (!VALIDATION_PATTERNS.inventory.test(form.inventory)) nextErrors.inventory = 'Inventory must be a numeric value.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    await dispatch(
      createProduct({
        title: form.title,
        sku: form.sku,
        category: form.category,
        price: Number(form.price),
        inventory: Number(form.inventory),
        variations: form.variations.split(',').map((item) => item.trim()).filter(Boolean),
        description: form.description,
      }),
    );
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="page-add-product">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>Add Product</h2>
          <p className="text-muted">Add new catalog items with structured product details.</p>
        </div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form noValidate onSubmit={onSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <Input label="Product title" name="title" value={form.title} onChange={onChange} error={errors.title} />
              </div>
              <div className="col-12 col-md-6">
                <Input label="SKU code" name="sku" value={form.sku} onChange={onChange} error={errors.sku} />
              </div>
              <div className="col-12 col-md-4">
                <Input label="Price" name="price" value={form.price} onChange={onChange} error={errors.price} />
              </div>
              <div className="col-12 col-md-4">
                <Input label="Inventory" name="inventory" value={form.inventory} onChange={onChange} error={errors.inventory} />
              </div>
              <div className="col-12 col-md-4">
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={onChange}>
                    <option>Accessories</option>
                    <option>Apparel</option>
                    <option>Electronics</option>
                    <option>Home</option>
                    <option>Office</option>
                    <option>Fitness</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-12">
                <Input
                  label="Variations"
                  name="variations"
                  value={form.variations}
                  onChange={onChange}
                  placeholder="Comma separated"
                />
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
                  />
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>
              </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Publish product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
