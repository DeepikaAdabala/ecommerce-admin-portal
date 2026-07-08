import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Box, FormControl, InputLabel, InputAdornment, MenuItem, Select, Stack, Typography, Paper, Alert, TextField, IconButton } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/axiosInstance';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT_FIELD = 'createdAt';
const DEFAULT_SORT_ORDER = 'desc';

const paymentStatusOptions = ['Paid', 'Pending', 'Failed', 'Refunded'];
const customerTierOptions = ['Bronze', 'Silver', 'Gold', 'Platinum'];
const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const productCategories = ['Accessories', 'Electronics', 'Fitness', 'Home', 'Office', 'Apparel'];

const columns = [
  {
    field: 'id',
    headerName: 'Order ID',
    width: 130,
    disableColumnMenu: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <Link to={`/orders/${params.value}`} className="text-primary text-decoration-none">
        {params.value}
      </Link>
    ),
  },
  { field: 'customerName', headerName: 'Client Name', flex: 1, minWidth: 170, disableColumnMenu: true, headerAlign: 'center', align: 'center' },
  { field: 'customerTier', headerName: 'Customer Tier', width: 120, disableColumnMenu: true, headerAlign: 'center', align: 'center' },
  { field: 'productTitle', headerName: 'Product', flex: 1.4, minWidth: 220, disableColumnMenu: true, headerAlign: 'center', align: 'center' },
  { field: 'productCategory', headerName: 'Product Category', width: 150, disableColumnMenu: true, headerAlign: 'center', align: 'center' },
  { field: 'paymentStatus', headerName: 'Payment Status', width: 140, disableColumnMenu: true, headerAlign: 'center', align: 'center' },
  { field: 'status', headerName: 'Order Status', width: 150, disableColumnMenu: true, headerAlign: 'center', align: 'center' },
  {
    field: 'total',
    headerName: 'Amount',
    type: 'number',
    width: 120,
    disableColumnMenu: true,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => (value != null ? `Rs${value.toFixed(2)}` : ''),
  },
  {
    field: 'createdAt',
    headerName: 'Date',
    type: 'dateTime',
    width: 180,
    disableColumnMenu: true,
    sortable: true,
    headerAlign: 'center',
    align: 'center',
    valueFormatter: ({ value }) => (value ? new Date(value).toLocaleString() : ''),
  },
];

function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) > 0 ? Number(searchParams.get('page')) : DEFAULT_PAGE;
  const limit = Number(searchParams.get('limit')) > 0 ? Number(searchParams.get('limit')) : DEFAULT_LIMIT;
  const sortField = searchParams.get('sortField') || DEFAULT_SORT_FIELD;
  const sortOrder = searchParams.get('sortOrder') || DEFAULT_SORT_ORDER;
  const searchQuery = searchParams.get('search') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';
  const customerTier = searchParams.get('customerTier') || '';
  const orderStatus = searchParams.get('orderStatus') || '';
  const productCategory = searchParams.get('productCategory') || '';

  const [searchTerm, setSearchTerm] = useState(searchQuery);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const updateParams = useCallback(
    (params) => {
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
        if (value === '' || value == null) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(value));
        }
      });

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const params = {
          page,
          limit,
          sortField,
          sortOrder,
        };

        if (searchQuery) params.search = searchQuery;
        if (paymentStatus) params.paymentStatus = paymentStatus;
        if (customerTier) params.customerTier = customerTier;
        if (orderStatus) params.orderStatus = orderStatus;
        if (productCategory) params.productCategory = productCategory;

        const response = await api.get('/orders', { params });
        setRows(response.orders || []);
        setRowCount(response.total ?? response.orders.length);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load analytic orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, sortField, sortOrder, searchQuery, paymentStatus, customerTier, orderStatus, productCategory]);

  const sortModel = [{ field: sortField, sort: sortOrder }];

  const commitSearch = useCallback(
    (value) => {
      const normalized = String(value).replace(/\s+/g, ' ').trim();
      updateParams({ search: normalized, page: 1 });
    },
    [updateParams],
  );

  return (
    <Box className="page-analytics">
      <Box className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <Box>
          <Typography variant="h5" component="h3" gutterBottom>
            Orders Console
          </Typography>
          <Typography color="text.secondary">
            {/* Live transactional monitoring with routing-aware pagination, sorting, and filters. */}
          </Typography>
        </Box>
      </Box>

      <Paper elevation={1} sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #f7fbff 0%, #eef7ff 100%)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150, flex: '0 0 150px', backgroundColor: '#ffffff', borderRadius: 1, p: 0.75 }} size="small">
            <InputLabel id="payment-status-label" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Payment Status
            </InputLabel>
            <Select
              labelId="payment-status-label"
              label="Payment Status"
              value={paymentStatus || 'All'}
              size="small"
              onChange={(event) => updateParams({ paymentStatus: event.target.value === 'All' ? '' : event.target.value, page: 1 })}
            >
              <MenuItem value="All">All</MenuItem>
              {paymentStatusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150, backgroundColor: '#ffffff', borderRadius: 1, p: 0.75 }} size="small">
            <InputLabel id="customer-tier-label" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Customer Tier
            </InputLabel>
            <Select
              labelId="customer-tier-label"
              label="Customer Tier"
              value={customerTier || 'All'}
              size="small"
              onChange={(event) => updateParams({ customerTier: event.target.value === 'All' ? '' : event.target.value, page: 1 })}
            >
              <MenuItem value="All">All</MenuItem>
              {customerTierOptions.map((tier) => (
                <MenuItem key={tier} value={tier}>
                  {tier}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150, backgroundColor: '#ffffff', borderRadius: 1, p: 0.75 }} size="small">
            <InputLabel id="order-status-label" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Order Status
            </InputLabel>
            <Select
              labelId="order-status-label"
              label="Order Status"
              value={orderStatus || 'All'}
              size="small"
              onChange={(event) => updateParams({ orderStatus: event.target.value === 'All' ? '' : event.target.value, page: 1 })}
            >
              <MenuItem value="All">All</MenuItem>
              {orderStatusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150, backgroundColor: '#ffffff', borderRadius: 1, p: 0.75 }} size="small">
            <InputLabel id="product-category-label" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Product Category
            </InputLabel>
            <Select
              labelId="product-category-label"
              label="Product Category"
              value={productCategory || 'All'}
              size="small"
              onChange={(event) => updateParams({ productCategory: event.target.value === 'All' ? '' : event.target.value, page: 1 })}
            >
              <MenuItem value="All">All</MenuItem>
              {productCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Search orders"
            placeholder="Search by order ID, customer, tier, status, product or category"
            variant="outlined"
            size="small"
            sx={{ minWidth: 280, maxWidth: 360, backgroundColor: '#ffffff', borderRadius: 1 }}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onBlur={() => commitSearch(searchTerm)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitSearch(searchTerm);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    title="Clear search"
                    onClick={() => {
                      setSearchTerm('');
                      commitSearch('');
                    }}
                    edge="end"
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Paper>

      <Paper elevation={1} sx={{ width: '100%', p: 2, backgroundColor: '#ffffff' }}>
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ height: 680, width: '100%', '& .MuiDataGrid-root': { border: 'none' } }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={rowCount}
            page={page - 1}
            pageSize={limit}
            pagination
            paginationMode="server"
            sortingMode="server"
            sortModel={sortModel}
            onPageChange={(newPage) => updateParams({ page: newPage + 1 })}
            onPageSizeChange={(newPageSize) => updateParams({ limit: newPageSize, page: 1 })}
            onSortModelChange={(model) => {
              const nextSort = model[0];
              if (nextSort) {
                updateParams({ sortField: nextSort.field, sortOrder: nextSort.sort, page: 1 });
              } else {
                updateParams({ sortField: DEFAULT_SORT_FIELD, sortOrder: DEFAULT_SORT_ORDER, page: 1 });
              }
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            loading={loading}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f8fbff',
                color: '#1e3aa8',
                fontWeight: 700,
                textTransform: 'capitalize',
                justifyContent: 'center',
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f3f5',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default Analytics;
