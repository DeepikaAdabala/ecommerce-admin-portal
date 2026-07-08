import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import BarChart from '../components/dashboard/BarChart';
import PieChart from '../components/dashboard/PieChart';
import useDashboardAnalytics from '../hooks/useDashboardAnalytics';
import { fetchOrders } from '../features/orders/ordersSlice';
import { fetchProducts } from '../features/products/productsSlice';
import EditOrder from './EditOrder';

// const statusColors = ['#2563eb', '#ec4899', '#f59e0b', '#10b981'];

function Dashboard() {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const { items: orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const {
    metrics,
    revenueByPeriod,
    revenueTrendData,
    ordersCountByPeriod,
    ordersCountTrendData,
    ordersStatusData: statusData,
    categorySalesData,
    topProductsData,
    lowStockProducts: analyticsLowStockProducts,
  } = useDashboardAnalytics(products, orders);
  const [revenuePeriod, setRevenuePeriod] = useState('month');
  const [ordersCountPeriod, setOrdersCountPeriod] = useState('month');
  const lowStockProducts = analyticsLowStockProducts;
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatCurrency = (value) =>
    `Rs${Number(value ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  const data = ['Deepika', 'Chindu', 'rishista']

  return (
    <div className="page-dashboard">
      <div className="mb-4">
        <div>
          <h2>Dashboard</h2>
        </div>
        <div className="dashboard-summary-widgets d-flex flex-column flex-sm-row align-items-stretch gap-3 mt-4">
          <div className="summary-pill summary-pill-portfolio shadow-sm rounded-3 p-3">
            <div className="summary-pill-label">Portfolio value</div>
            <div className="summary-pill-value">{formatCurrency(metrics.totalPortfolioValue)}</div>
          </div>
          <div className="summary-pill summary-pill-units shadow-sm rounded-3 p-3">
            <div className="summary-pill-label">Total units</div>
            <div className="summary-pill-value">{metrics.totalInventoryUnits.toLocaleString()}</div>
          </div>
          <div className="summary-pill summary-pill-skus shadow-sm rounded-3 p-3">
            <div className="summary-pill-label">Active SKUs</div>
            <div className="summary-pill-value">{metrics.activeProductCount}</div>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-muted small mb-1">Revenue generated</p>
                  <h3 className="h5 mb-0">{formatCurrency(revenueByPeriod[revenuePeriod])}</h3>
                </div>
                <div className="btn-group btn-group-sm dashboard-toggle-group" role="group">
                  {['today', 'week', 'month', 'year'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      className={`btn btn-outline-secondary ${revenuePeriod === period ? 'active' : ''}`}
                      onClick={() => setRevenuePeriod(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-muted small mb-3">Revenue trend for the selected timeframe.</p>
              <BarChart
                data={revenueTrendData[revenuePeriod]}
                label={`Revenue in  ${revenuePeriod === 'year' ? 'by quarter' : revenuePeriod === 'month' ? 'by week' : revenuePeriod === 'week' ? 'by day' : 'by time'}`}
                isVertical={true}
                xAxisLabel={revenuePeriod === 'year' ? 'Quarter' : revenuePeriod === 'week' ? 'Day' : revenuePeriod === 'month' ? 'Days' : 'Hour'}
                yAxisLabel="Revenue in Rs"
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-muted small mb-1">No. of sales / orders</p>
                  <h3 className="h5 mb-0">{ordersCountByPeriod[ordersCountPeriod]}</h3>
                </div>
                <div className="btn-group btn-group-sm dashboard-toggle-group" role="group">
                  {['today', 'week', 'month', 'year'].map((period) => (
                    <button
                      key={period}
                      type="button"
                      className={`btn btn-outline-secondary ${ordersCountPeriod === period ? 'active' : ''}`}
                      onClick={() => setOrdersCountPeriod(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-muted small mb-3">Sales/Orders placed for the selected timeframe
                .</p>
              <BarChart
                data={ordersCountTrendData[ordersCountPeriod]}
                label={`Orders ${ordersCountPeriod === 'year' ? 'by quarter' : ordersCountPeriod === 'month' ? 'by week' : ordersCountPeriod === 'week' ? 'by day' : 'by time'}`}
                isVertical={true}
                xAxisLabel={ordersCountPeriod === 'year' ? 'Quarter' : ordersCountPeriod === 'week' ? 'Day' : ordersCountPeriod === 'month' ? 'Days' : 'Hour'}
                yAxisLabel="Orders"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <PieChart data={statusData} colors={['#f97316', '#2563eb', '#8b5cf6', '#14b8a6', '#ec4899']} label="Orders by status" />
        </div>
        <div className="col-12 col-lg-6">
          <PieChart data={categorySalesData} colors={['#f97316', '#2563eb', '#8b5cf6', '#14b8a6', '#ec4899']} label="Sales by category" />
        </div>
      </div>
      <div className="row g-4 mb-4 dashboard-grid-equal">
        <div className="col-12 col-md-6 col-xl-6 d-flex">
          <BarChart data={topProductsData} label="Top selling products" />
        </div>
        <div className="col-12 col-md-6 col-xl-6 d-flex">
          <div className="chart-card h-100">
            <div className="chart-header">
              <h6 className="mb-1">Low stock alerts</h6>
            </div>
            <div className="list-group list-group-flush">
              {lowStockProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{product.title}</div>
                    <small className="text-muted">{product.category}</small>
                  </div>
                  <span className="badge bg-warning text-dark">{product.inventory}</span>
                </div>
              ))}
              {!lowStockProducts.length && <div className="list-group-item text-muted">All stock levels are healthy.</div>}
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1">Recent orders</h5>
            </div>
          </div>
          <div className="table-responsive">
            <EditOrder data = {data}/>
            <table className="table mb-0 align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/orders/${order.id}`} className="text-decoration-none">
                        {order.id}
                      </Link>
                    </td>
                    <td>{order.customerName}</td>
                    <td>{order.quantity || 1}</td>
                    <td>Rs{order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;