import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productsSlice';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';

function Products() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const normalizedSearch = (val = '') => val.toString().toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!searchTerm) return items;
    const needle = normalizedSearch(searchTerm);
    return items.filter((p) => {
      const hay = [p.sku, p.title, p.category, p.description].join(' | ');
      return normalizedSearch(hay).includes(needle);
    });
  }, [items, searchTerm]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="page-products">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>Products</h2>
          {/* <p className="text-muted">Catalog grid with active products, variations, and quick management options.</p> */}
        </div>
        <Link to="/products/add" className="btn btn-primary">
  Add Product
</Link>
      </div>
      {loading && <div className="alert alert-info">Loading products...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3 d-flex flex-column flex-md-row gap-2 align-items-stretch align-items-md-center">
        <div className="flex-grow-1 d-flex gap-2 align-items-center">
          <input
            type="search"
            className="form-control"
            placeholder="Search SKU, title, category, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>Clear</button>
        </div>
        <div className="btn-group" role="group" aria-label="Product view toggle">
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <ViewModuleIcon fontSize="small" />
          </button>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <ViewListIcon fontSize="small" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="row g-4">
          {filtered.map((product) => (
            <div className="col-12 col-md-6 col-xl-4" key={product.id}>
              <Link to={`/products/${product.id}`} className="text-decoration-none">
                <Card title={product.title} value={`Rs${product.price.toFixed(2)}`}>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className={`badge ${product.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                      {product.status}
                    </span>
                    <span className="badge bg-info text-dark">{product.category}</span>
                  </div>
                  <p className="mb-1 text-secondary mt-1">SKU {product.sku}</p>
                  <p className="mb-1 text-secondary">Stock {product.inventory}</p>
                  <p className="mb-0 text-muted small">{product.description}</p>
                </Card>
              </Link>
            </div>
          ))}
          {!filtered.length && !loading && <div className="col-12"><div className="alert alert-warning">No products match your search.</div></div>}
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Link to={`/products/${product.id}`} className="text-decoration-none fw-semibold text-dark">
                        {product.title}
                      </Link>
                      <div className="text-muted small">SKU {product.sku}</div>
                    </td>
                    <td>Rs{product.price.toFixed(2)}</td>
                    <td>{product.inventory}</td>
                    <td>{product.category}</td>
                    <td>
                      <span className={`badge ${product.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && !loading && <div className="alert alert-warning m-3">No products match your search.</div>}
        </div>
      )}
    </div>
  );
}

export default Products;
