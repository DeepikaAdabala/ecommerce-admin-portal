import { Alert, Chip, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { initialOrders } from '../data/mockOrders';
import { initialProducts } from '../data/mockProducts';

const LOW_STOCK_THRESHOLD = 50;
const SERVER_DOWNTIME_ALERT = {
  id: 'downtime',
  title: 'Scheduled Server Downtime',
  detail: 'Planned maintenance will begin at 02:00 AM UTC for platform updates and monitoring checks.',
};

function Notifications() {
  const lowStockProducts = initialProducts.filter(
    (product) => product.inventory > 0 && product.inventory <= LOW_STOCK_THRESHOLD,
  );
  const outOfStockProducts = initialProducts.filter((product) => product.inventory === 0);
  const recentOrders = [...initialOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

  return (
    <div className="d-flex flex-column gap-3">
      <Stack direction="row" alignItems="center" spacing={1}>
        <NotificationsActiveIcon color="primary" />
        <Typography variant="h4" component="h2">
          Notifications Center
        </Typography>
      </Stack>
      {/* <Typography color="text.secondary">
        Monitor inventory, order activity, and platform events from one centralized view.
      </Typography> */}

      <Stack spacing={2}>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <div>
              <Typography variant="subtitle1" fontWeight={700}>
                Low Stock Alerts
              </Typography>
              <Typography color="text.secondary">
                Products below the low stock threshold of {LOW_STOCK_THRESHOLD} units.
              </Typography>
            </div>
            <Chip label="Warning" color="warning" size="small" />
          </Stack>
          <Divider sx={{ my: 2 }} />
          {lowStockProducts.length > 0 ? (
            <List disablePadding>
              {lowStockProducts.map((product) => (
                <ListItem key={product.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={product.title}
                    secondary={`Inventory: ${product.inventory} ${product.inventory === 1 ? 'unit' : 'units'}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No low stock products at the moment.</Typography>
          )}
        </Paper>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <div>
              <Typography variant="subtitle1" fontWeight={700}>
                Out of Stock
              </Typography>
              <Typography color="text.secondary">Items with zero inventory and waiting to be restocked.</Typography>
            </div>
            <Chip label="Critical" color="error" size="small" />
          </Stack>
          <Divider sx={{ my: 2 }} />
          {outOfStockProducts.length > 0 ? (
            <List disablePadding>
              {outOfStockProducts.map((product) => (
                <ListItem key={product.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText primary={product.title} secondary={`SKU: ${product.sku}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No out of stock products currently.</Typography>
          )}
        </Paper>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <div>
              <Typography variant="subtitle1" fontWeight={700}>
                New Orders Received
              </Typography>
              <Typography color="text.secondary">Most recent orders sorted by purchase time.</Typography>
            </div>
            <Chip label="New" color="default" size="small" />
          </Stack>
          <Divider sx={{ my: 2 }} />
          {recentOrders.length > 0 ? (
            <List disablePadding>
              {recentOrders.map((order) => (
                <ListItem key={order.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={`${order.productTitle} — ${order.customerName}`}
                    secondary={`${formatDateTime(order.createdAt)} • ${order.status} • ${order.paymentStatus}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">No recent orders found.</Typography>
          )}
        </Paper>

        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <div>
              <Typography variant="subtitle1" fontWeight={700}>
                {SERVER_DOWNTIME_ALERT.title}
              </Typography>
              <Typography color="text.secondary">{SERVER_DOWNTIME_ALERT.detail}</Typography>
            </div>
            <Chip label="Info" color="info" size="small" />
          </Stack>
        </Paper>
      </Stack>

      {/* <Alert severity="info">
        These alerts are designed to help operations teams respond quickly to stock changes, new purchases, and scheduled maintenance.
      </Alert> */}
    </div>
  );
}

export default Notifications;
