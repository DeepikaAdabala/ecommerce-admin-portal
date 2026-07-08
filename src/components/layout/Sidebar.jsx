import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArticleIcon from '@mui/icons-material/Article';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toggleSidebarExpanded } from '../../features/layout/layoutSlice';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
  { path: '/orders', label: 'Orders', icon: <ShoppingCartIcon fontSize="small" /> },
  { path: '/products', label: 'Products', icon: <InventoryIcon fontSize="small" /> },
  { path: '/customers', label: 'Customers', icon: <PeopleIcon fontSize="small" /> },
  { path: '/inventory', label: 'Inventory', icon: <LocalOfferIcon fontSize="small" /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChartIcon fontSize="small" /> },
  { path: '/marketing', label: 'Marketing', icon: <ArticleIcon fontSize="small" /> },
  { path: '/content', label: 'Content', icon: <ArticleIcon fontSize="small" /> },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon fontSize="small" /> },
];

function Sidebar() {
  const dispatch = useDispatch();
  const expanded = useSelector((state) => state.layout.sidebarExpanded);

  return (
    <nav className={`sidebar bg-white border-end ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className={`sidebar-inner ${expanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-toggle p-2 d-flex justify-content-end">
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => dispatch(toggleSidebarExpanded())}>
            {expanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </button>
        </div>
        <div className="list-group list-group-flush">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                  isActive ? 'active' : 'text-dark'
                }`
              }
            >
              <div className="sidebar-icon d-flex align-items-center justify-content-center">{item.icon}</div>
              {expanded && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
