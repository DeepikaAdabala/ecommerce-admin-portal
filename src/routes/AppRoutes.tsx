import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import AddOrder from '../pages/AddOrder';
import EditOrder from '../pages/EditOrder';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import AddProduct from '../pages/AddProduct';
import Customers from '../pages/Customers';
import Inventory from '../pages/Inventory';
import Marketing from '../pages/Marketing';
import Content from '../pages/Content';
import Analytics from '../pages/Analytics';
import Settings from '../pages/Settings';
import AccountInformation from '../pages/AccountInformation';
import Notifications from '../pages/Notifications';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/add" element={<AddOrder />} />
        <Route path="orders/edit/:orderId" element={<EditOrder />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:productId" element={<ProductDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="content" element={<Content />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/account" element={<AccountInformation />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
