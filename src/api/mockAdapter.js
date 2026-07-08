import { initialProducts } from '../data/mockProducts';
import { initialCustomers } from '../data/mockCustomers';
import { initialOrders } from '../data/mockOrders';

let productCatalog = [...initialProducts];
let customerCatalog = [...initialCustomers];
let orderCatalog = [...initialOrders];

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const getTierByLifetimeValue = (value) => {
  const amount = Number(value) || 0;
  if (amount > 3000) return 'Platinum';
  if (amount > 1500) return 'Gold';
  if (amount > 500) return 'Silver';
  return 'Bronze';
};

const createResponse = (config, data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config,
});

const mockAdapter = async (config) => {
  await delay(500);
  const url = config.url?.replace(config.baseURL ?? '', '') || config.url || '';
  const method = config.method?.toLowerCase();

  if (method === 'get' && url === '/products') {
    return createResponse(config, { products: productCatalog }, 200);
  }

  if (method === 'post' && url === '/products') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const createdProduct = {
      id: `prod-${Date.now()}`,
      title: payload.title,
      sku: payload.sku,
      category: payload.category || 'Accessories',
      price: Number(payload.price),
      inventory: Number(payload.inventory),
      variations: payload.variations,
      description: payload.description,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    productCatalog = [createdProduct, ...productCatalog];
    return createResponse(config, { product: createdProduct }, 201);
  }

  if (method === 'put' && url.startsWith('/products/')) {
    const productId = url.split('/')[2];
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    productCatalog = productCatalog.map((product) =>
      product.id === productId
        ? {
            ...product,
            title: payload.title,
            sku: payload.sku,
            category: payload.category || product.category,
            price: Number(payload.price),
            inventory: Number(payload.inventory),
            variations: payload.variations,
            description: payload.description,
          }
        : product,
    );
    const updatedProduct = productCatalog.find((product) => product.id === productId);
    return createResponse(config, { product: updatedProduct }, 200);
  }

  if (method === 'delete' && url.startsWith('/products/')) {
    const productId = url.split('/')[2];
    productCatalog = productCatalog.filter((product) => product.id !== productId);
    return createResponse(config, { deleted: productId }, 200);
  }

  if (method === 'get' && url === '/customers') {
    const customersWithTier = customerCatalog.map((customer) => ({
      ...customer,
      tier: getTierByLifetimeValue(customer.lifetimeValue),
    }));
    return createResponse(config, { customers: customersWithTier }, 200);
  }

  if (method === 'post' && url === '/customers') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const createdCustomer = {
      id: `cust-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      tier: getTierByLifetimeValue(payload.lifetimeValue),
      lastOrder: payload.lastOrder,
      lifetimeValue: Number(payload.lifetimeValue),
      status: 'active',
    };
    customerCatalog = [createdCustomer, ...customerCatalog];
    return createResponse(config, { customer: createdCustomer }, 201);
  }

  if (method === 'put' && url.startsWith('/customers/')) {
    const customerId = url.split('/')[2];
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    customerCatalog = customerCatalog.map((customer) =>
      customer.id === customerId
        ? {
            ...customer,
            name: payload.name,
            email: payload.email,
            tier: getTierByLifetimeValue(payload.lifetimeValue),
            lastOrder: payload.lastOrder,
            lifetimeValue: Number(payload.lifetimeValue),
          }
        : customer,
    );
    const updatedCustomer = customerCatalog.find((customer) => customer.id === customerId);
    return createResponse(config, { customer: updatedCustomer }, 200);
  }

  if (method === 'delete' && url.startsWith('/customers/')) {
    const customerId = url.split('/')[2];
    customerCatalog = customerCatalog.filter((customer) => customer.id !== customerId);
    return createResponse(config, { deleted: customerId }, 200);
  }

  if (method === 'get' && url === '/orders') {
    const params = config.params || {};
    const pageNumber = Number(params.page) > 0 ? Number(params.page) : 1;
    const pageSize = Number(params.limit) > 0 ? Number(params.limit) : orderCatalog.length;
    const sortField = params.sortField || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
    const paymentStatusFilter = params.paymentStatus || '';
    const customerTierFilter = params.customerTier || '';
    const orderStatusFilter = params.orderStatus || '';
    const productCategoryFilter = params.productCategory || '';
    const startDateFilter = params.startDate ? new Date(params.startDate) : null;
    const endDateFilter = params.endDate ? new Date(params.endDate) : null;

    const searchFilter = String(params.search || '').trim().toLowerCase();

    const enrichedOrders = orderCatalog.map((order) => {
      const product = productCatalog.find((item) => item.id === order.productId) || {};
      const customer = customerCatalog.find((item) => item.name === order.customerName) || {};

      return {
        ...order,
        productTitle: order.productTitle || product.title || 'Unknown product',
        productCategory: product.category || 'Unknown',
        customerTier: getTierByLifetimeValue(customer.lifetimeValue),
      };
    });

    let filtered = enrichedOrders;
    if (searchFilter) {
      filtered = filtered.filter((order) => {
        const fields = [
          order.id,
          order.customerName,
          order.customerTier,
          order.paymentStatus,
          order.status,
          order.productTitle,
          order.productCategory,
        ];

        return fields.some((field) => String(field).toLowerCase().includes(searchFilter));
      });
    }

    if (paymentStatusFilter) {
      filtered = filtered.filter((order) => order.paymentStatus === paymentStatusFilter);
    }
    if (customerTierFilter) {
      filtered = filtered.filter((order) => order.customerTier === customerTierFilter);
    }
    if (orderStatusFilter) {
      filtered = filtered.filter((order) => order.status === orderStatusFilter);
    }
    if (productCategoryFilter) {
      filtered = filtered.filter((order) => order.productCategory === productCategoryFilter);
    }
    if (startDateFilter) {
      filtered = filtered.filter((order) => new Date(order.createdAt) >= startDateFilter);
    }
    if (endDateFilter) {
      filtered = filtered.filter((order) => new Date(order.createdAt) <= endDateFilter);
    }

    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortField] ?? '';
      const bValue = b[sortField] ?? '';

      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
    });

    const total = sorted.length;
    const startIndex = (pageNumber - 1) * pageSize;
    const paged = sorted.slice(startIndex, startIndex + pageSize);

    return createResponse(config, { orders: paged, total }, 200);
  }

  if (method === 'post' && url === '/orders') {
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const createdOrder = {
      id: `ord-${Date.now()}`,
      customerName: payload.customerName,
      total: Number(payload.total),
      quantity: Number(payload.quantity) || 1,
      status: payload.status || 'Pending',
      paymentStatus: payload.paymentStatus || 'Pending',
      productId: payload.productId,
      productTitle: payload.productTitle,
      createdAt: new Date(payload.createdAt).toISOString(),
    };
    orderCatalog = [createdOrder, ...orderCatalog];
    return createResponse(config, { order: createdOrder }, 201);
  }

  if (method === 'put' && url.startsWith('/orders/')) {
    const orderId = url.split('/')[2];
    const payload = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    orderCatalog = orderCatalog.map((order) =>
      order.id === orderId
        ? {
            ...order,
            customerName: payload.customerName,
            total: Number(payload.total),
            quantity: Number(payload.quantity) || 1,
            status: payload.status,
            paymentStatus: payload.paymentStatus || 'Pending',
            createdAt: new Date(payload.createdAt).toISOString(),
          }
        : order,
    );
    const updatedOrder = orderCatalog.find((order) => order.id === orderId);
    return createResponse(config, { order: updatedOrder }, 200);
  }

  if (method === 'delete' && url.startsWith('/orders/')) {
    const orderId = url.split('/')[2];
    orderCatalog = orderCatalog.filter((order) => order.id !== orderId);
    return createResponse(config, { deleted: orderId }, 200);
  }

  return createResponse(config, { message: 'Endpoint not implemented' }, 404);
};

export default mockAdapter;
