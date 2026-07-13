import { useEffect } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { fetchProducts } from '../features/products/productsSlice';
import type { RootState, AppDispatch } from '../store';
import type { Product } from '../types/ecommerce';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function Inventory() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categorySummary = items.reduce<Record<string, { count: number; stock: number }>>((summary, product: Product) => {
    const current = summary[product.category] || { count: 0, stock: 0 };

    summary[product.category] = {
      count: current.count + 1,
      stock: current.stock + product.inventory,
    };

    return summary;
  }, {});

  const cardColors = [
    '#d4edda', 
    '#e6d5ff', 
    '#fff3cd', 
    '#d1ecf1', 
    '#e9ecef', 
    '#f8d7da', 
  ];

  return (
    <div className="page-inventory">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2>Inventory</h2>
          <p className="text-muted">
            {/* Track stock levels and category performance in one place. */}
          </p>
        </div>
      </div>

      {loading && (
        <div className="alert alert-info">
          Loading inventory data...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row g-3 mb-4">
        {Object.entries(categorySummary).map(([category, stats], index) => (
          <div key={category} className="col-12 col-md-6 col-xl-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                backgroundColor: cardColors[index % cardColors.length],
                borderRadius: '12px',
                transition: 'transform 0.2s ease',
              }}
            >
              <div className="card-body">
                <h5 className="card-title fw-bold">{category}</h5>

                <p className="text-muted mb-2">
                  Products: <strong>{stats.count}</strong>
                </p>

                <p className="mb-0">
                  Total Stock: <strong>{stats.stock}</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Category inventory detail</h5>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Products</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorySummary).map(([category, stats]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{stats.count}</td>
                    <td>{stats.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Inventory;