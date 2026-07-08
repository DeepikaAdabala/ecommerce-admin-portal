import { useMemo, useState } from 'react';
import { Box, Chip, Collapse, IconButton, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { initialOrders } from '../../data/mockOrders';
import { initialProducts } from '../../data/mockProducts';

const LOW_STOCK_THRESHOLD = 50;
const SERVER_DOWNTIME_ALERT = {
  title: 'Scheduled Server Downtime',
  detail: 'Planned maintenance will begin at 02:00 AM UTC for platform updates and monitoring checks.',
};

function NotificationPopover() {
  const [expandedId, setExpandedId] = useState(null);

  const notifications = useMemo(() => {
    const lowStockProducts = initialProducts.filter(
      (product) => product.inventory > 0 && product.inventory <= LOW_STOCK_THRESHOLD,
    );
    const outOfStockProducts = initialProducts.filter((product) => product.inventory === 0);
    const recentOrders = [...initialOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const items = [
      ...lowStockProducts.map((product) => ({
        id: `stock-${product.id}`,
        title: 'Low Stock Alert',
        summary: `${product.title} is running low with ${product.inventory} units left.`,
        detail: `${product.title} is low stock. Restock soon to avoid missed sales.`,
        type: 'warning',
      })),
      ...outOfStockProducts.map((product) => ({
        id: `out-${product.id}`,
        title: 'Out of Stock',
        summary: `${product.title} is currently unavailable.`,
        detail: `${product.title} has zero inventory and is awaiting replenishment.`,
        type: 'error',
      })),
      ...recentOrders.map((order) => ({
        id: `order-${order.id}`,
        title: 'New Order Received',
        summary: `${order.productTitle} — ${order.customerName}`,
        detail: `${order.productTitle} was ordered by ${order.customerName} on ${new Date(order.createdAt).toLocaleString()}.`,
        type: 'info',
      })),
      {
        id: 'downtime',
        title: SERVER_DOWNTIME_ALERT.title,
        summary: SERVER_DOWNTIME_ALERT.detail,
        detail: SERVER_DOWNTIME_ALERT.detail,
        type: 'info',
      },
    ];

    return items;
  }, []);

  const toggleExpanded = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <Paper elevation={6} sx={{ width: 360, maxHeight: 420, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Notifications
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {/* Recent inventory and order updates */}
        </Typography>
      </Box>
      <Box sx={{ maxHeight: 340, overflowY: 'auto', p: 1 }}>
        <List disablePadding>
          {notifications.map((notification) => {
            const isExpanded = expandedId === notification.id;
            return (
              <ListItemButton key={notification.id} sx={{ borderRadius: 1, mb: 1, px: 1.25, py: 1 }} disableRipple>
                <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ width: '100%' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2" fontWeight={700}>
                        {notification.title}
                      </Typography>
                      <Chip label={notification.type === 'warning' ? 'Warning' : notification.type === 'error' ? 'Critical' : 'Info'} size="small" color={notification.type === 'warning' ? 'warning' : notification.type === 'error' ? 'error' : 'info'} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {notification.summary}
                    </Typography>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {notification.detail}
                      </Typography>
                    </Collapse>
                  </Box>
                  <IconButton size="small" onClick={() => toggleExpanded(notification.id)}>
                    {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                </Stack>
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
}

export default NotificationPopover;
