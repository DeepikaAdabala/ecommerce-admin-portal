import { useState, type MouseEvent } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { initialOrders } from '../../data/mockOrders';
import { initialProducts } from '../../data/mockProducts';
import NotificationPopover from './NotificationPopover';

const LOW_STOCK_THRESHOLD = 50;

function Header() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const lowStockCount = initialProducts.filter(
    (product) => product.inventory > 0 && product.inventory <= LOW_STOCK_THRESHOLD,
  ).length;
  const outOfStockCount = initialProducts.filter((product) => product.inventory === 0).length;
  const recentOrdersCount = [...initialOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5).length;
  const notificationCount = lowStockCount + outOfStockCount + recentOrdersCount + 1;

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="app-header d-flex align-items-center justify-content-between flex-nowrap px-4 py-3 border-bottom">
      <div className="d-flex align-items-center gap-3 header-brand-group">
        <div className="header-portal-label text-pink fw-semibold">Admin Portal</div>
      </div>
      <div className="header-brand-box text-center flex-fill px-2">
        <h1 className="mb-0 header-title">
          HELIS
          <span className="header-title-accent"> Commerce</span>
        </h1>
      </div>
      <div className="d-flex align-items-center gap-2">
        <IconButton
          color="inherit"
          aria-label="Open notifications"
          size="small"
          className="header-action-icon"
          onClick={handleOpen}
        >
          <Badge badgeContent={notificationCount} color="error" overlap="circular">
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { mt: 1, borderRadius: 2, overflow: 'visible' } } }}
        >
          <NotificationPopover />
        </Popover>
        <div className="d-flex align-items-center gap-2 px-3 py-2 border rounded shadow-sm flex-shrink-0 bg-danger-subtle header-user-box">
          <AccountCircleIcon fontSize="small" className="text-primary" />
          <div className="fw-semibold text-dark">Deepika A</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
