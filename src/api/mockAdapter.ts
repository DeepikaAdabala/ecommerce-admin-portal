import type { AxiosRequestConfig } from 'axios';
import { initialProducts } from '../data/mockProducts';
import { initialCustomers } from '../data/mockCustomers';
import { initialOrders } from '../data/mockOrders';
import type { Customer, Order, Product } from '../types/ecommerce';

type MockConfig = AxiosRequestConfig & {
  url?: string;
  baseURL?: string;
  method?: string;
  data?: unknown;
  params?: Record<string, unknown>;
};

let productCatalog: Product[] = [...initialProducts];
let customerCatalog: Customer[] = [...initialCustomers];
let orderCatalog: Order[] = [...initialOrders];

const delay = (time: number) => new Promise<void>((resolve) => setTimeout(resolve, time));

const getTierByLifetimeValue = (value: number | string | null | undefined): string => {
  const amount = Number(value) || 0;
  if (amount > 3000) return 'Platinum';
  if (amount > 1500) return 'Gold';
  if (amount > 500) return 'Silver';
  return 'Bronze';
};

const createResponse = (config: MockConfig, data: unknown, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config,
});

const readPayload = (config: MockConfig): Record<string, unknown> => {
  if (typeof config.data === 'string') {
    try {
      return JSON.parse(config.data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  return (config.data as Record<string, unknown> | undefined) ?? {};
};

const mockAdapter = async (config: MockConfig) => {
  await delay(500);
  const url = config.url?.replace(config.baseURL ?? '', '') || config.url || '';
  const method = config.method?.toLowerCase();

  if (method === 'get' && url === '/products') {
    return createResponse(config, { products: productCatalog }, 200);
  }

  if (method === 'post' && url === '/products') {
    const payload = readPayload(config);
    const createdProduct: Product = {
      id: `prod-${Date.now()}`,
      title: String(payload.title ?? ''),
      sku: String(payload.sku ?? ''),
      category: String(payload.category ?? 'Accessories'),
      price: Number(payload.price) || 0,
      inventory: Number(payload.inventory) || 0,
      variations: Array.isArray(payload.variations) ? payload.variations.map((item) => String(item)) : [],
      description: String(payload.description ?? ''),
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    productCatalog = [createdProduct, ...productCatalog];
    return createResponse(config, { product: createdProduct }, 201);
  }

  if (method === 'put' && url.startsWith('/products/')) {
    const productId = url.split('/')[2];
    const payload = readPayload(config);
    productCatalog = productCatalog.map((product) =>
      product.id === productId
        ? {
            ...product,
            title: String(payload.title ?? product.title),
            sku: String(payload.sku ?? product.sku),
            category: String(payload.category ?? product.category),
            price: Number(payload.price) || product.price,
            inventory: Number(payload.inventory) || product.inventory,
            variations: Array.isArray(payload.variations) ? payload.variations.map((item) => String(item)) : product.variations,
            description: String(payload.description ?? product.description),
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
      tier: getTierByLifetimeValue(customer.lifetimeValue) as Customer['tier'],
    }));
    return createResponse(config, { customers: customersWithTier }, 200);
  }

  if (method === 'post' && url === '/customers') {
    const payload = readPayload(config);
    const lifetimeValueInput = payload.lifetimeValue;
    const lifetimeValue = typeof lifetimeValueInput === 'number' || typeof lifetimeValueInput === 'string'
      ? Number(lifetimeValueInput)
      : 0;
    const createdCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: String(payload.name ?? ''),
      email: String(payload.email ?? ''),
      tier: getTierByLifetimeValue(lifetimeValue) as Customer['tier'],
      lastOrder: String(payload.lastOrder ?? ''),
      lifetimeValue,
      status: 'active',
    };
    customerCatalog = [createdCustomer, ...customerCatalog];
    return createResponse(config, { customer: createdCustomer }, 201);
  }

  if (method === 'put' && url.startsWith('/customers/')) {
    const customerId = url.split('/')[2];
    const payload = readPayload(config);
    const lifetimeValueInput = payload.lifetimeValue;
    const lifetimeValue = typeof lifetimeValueInput === 'number' || typeof lifetimeValueInput === 'string'
      ? Number(lifetimeValueInput)
      : customerCatalog.find((customer) => customer.id === customerId)?.lifetimeValue ?? 0;
    customerCatalog = customerCatalog.map((customer) =>
      customer.id === customerId
        ? {
            ...customer,
            name: String(payload.name ?? customer.name),
            email: String(payload.email ?? customer.email),
            tier: getTierByLifetimeValue(lifetimeValue) as Customer['tier'],
            lastOrder: String(payload.lastOrder ?? customer.lastOrder),
            lifetimeValue,
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
      const product = productCatalog.find((item) => item.id === order.productId) ?? ({} as Product);
      const customer = customerCatalog.find((item) => item.name === order.customerName) ?? ({} as Customer);

      return {
        ...order,
        productTitle: order.productTitle || product.title || 'Unknown product',
        productCategory: product.category || 'Unknown',
        customerTier: getTierByLifetimeValue(customer.lifetimeValue) as Customer['tier'],
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
      const aValue = (a as Record<string, unknown>)[String(sortField)] ?? '';
      const bValue = (b as Record<string, unknown>)[String(sortField)] ?? '';

      if (String(sortField) === 'createdAt') {
        const aTime = new Date(String(aValue)).getTime();
        const bTime = new Date(String(bValue)).getTime();
        return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
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
    const payload = readPayload(config);
    const createdOrder: Order = {
      id: `ord-${Date.now()}`,
      customerName: String(payload.customerName ?? ''),
      total: Number(payload.total) || 0,
      quantity: Number(payload.quantity) || 1,
      status: (payload.status as Order['status']) ?? 'Pending',
      paymentStatus: (payload.paymentStatus as Order['paymentStatus']) ?? 'Pending',
      productId: payload.productId ? String(payload.productId) : undefined,
      productTitle: payload.productTitle ? String(payload.productTitle) : undefined,
      createdAt: new Date(String(payload.createdAt ?? new Date().toISOString())).toISOString(),
    };
    orderCatalog = [createdOrder, ...orderCatalog];
    return createResponse(config, { order: createdOrder }, 201);
  }

  if (method === 'put' && url.startsWith('/orders/')) {
    const orderId = url.split('/')[2];
    const payload = readPayload(config);
    orderCatalog = orderCatalog.map((order) =>
      order.id === orderId
        ? {
            ...order,
            customerName: String(payload.customerName ?? order.customerName),
            total: Number(payload.total) || order.total,
            quantity: Number(payload.quantity) || order.quantity,
            status: (payload.status as Order['status']) ?? order.status,
            paymentStatus: (payload.paymentStatus as Order['paymentStatus']) ?? order.paymentStatus,
            createdAt: new Date(String(payload.createdAt ?? order.createdAt)).toISOString(),
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
