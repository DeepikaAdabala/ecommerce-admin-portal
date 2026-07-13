import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import type { DashboardAnalyticsResult, DashboardMetricSummary, Product, Order, ChartDatum, TrendSeries } from '../types/ecommerce';

const normalizeText = (value: string | number | undefined | null): string => value?.toString().toLowerCase().trim() ?? '';

const buildSearchText = (product: Product): string => {
  const fields = [product.sku, product.title, product.category, product.description];
  return fields.map(normalizeText).join(' | ');
};

const mapOrdersByQuarter = (orders: Order[] = []): ChartDatum[] => {
  const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const quarterData = quarterLabels.map((label) => ({ label, value: 0 }));

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const quarterIndex = Math.min(3, Math.floor(date.getMonth() / 3));
    quarterData[quarterIndex].value += order.total;
  });

  return quarterData;
};

const mapOrderStatusData = (orders: Order[] = []): ChartDatum[] => {
  const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
    const status = order.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const preferredStatuses = ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled', 'Refunded'];

  return preferredStatuses
    .filter((status) => statusCounts[status])
    .map((status) => ({ label: status, value: statusCounts[status] }));
};

const mapRevenueByPeriod = (orders: Order[] = []): Record<string, number> => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6);

  const startOfMonth = new Date(startOfToday);
  startOfMonth.setDate(startOfToday.getDate() - 30);

  const startOfYear = new Date(startOfToday);
  startOfYear.setMonth(0);
  startOfYear.setDate(1);

  return orders.reduce(
    (acc, order) => {
      const createdAt = new Date(order.createdAt);
      const amount = Number(order.total) || 0;

      if (createdAt >= startOfToday) {
        acc.today += amount;
      }
      if (createdAt >= startOfWeek) {
        acc.week += amount;
      }
      if (createdAt >= startOfMonth) {
        acc.month += amount;
      }
      if (createdAt >= startOfYear) {
        acc.year += amount;
      }

      return acc;
    },
    { today: 0, week: 0, month: 0, year: 0 },
  );
};

const mapRevenueTrendData = (orders: Order[] = []): TrendSeries => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6);

  const startOfMonth = new Date(startOfToday);
  startOfMonth.setDate(startOfToday.getDate() - 30);

  const todayBuckets = [
    { label: '6h', value: 0, start: 0, end: 6 },
    { label: '12h', value: 0, start: 6, end: 12 },
    { label: '18h', value: 0, start: 12, end: 18 },
    { label: '24h', value: 0, start: 18, end: 24 },
  ];

  const weekLabels = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return { label: day.toLocaleDateString('en-US', { weekday: 'short' }), value: 0, date: day };
  });

  const monthBuckets = [
    { label: 'Week 1', value: 0, start: 0, end: 7 },
    { label: 'Week 2', value: 0, start: 7, end: 14 },
    { label: 'Week 3', value: 0, start: 14, end: 21 },
    { label: 'Week 4', value: 0, start: 21, end: 31 },
  ];

  const yearBuckets = [
    { label: 'Q1', value: 0, start: 0, end: 3 },
    { label: 'Q2', value: 0, start: 3, end: 6 },
    { label: 'Q3', value: 0, start: 6, end: 9 },
    { label: 'Q4', value: 0, start: 9, end: 12 },
  ];

  orders.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    const amount = Number(order.total) || 0;

    if (createdAt >= startOfToday) {
      const hour = createdAt.getUTCHours();
      const bucket = todayBuckets.find((item) => hour >= item.start && hour < item.end);
      if (bucket) bucket.value += amount;
    }

    if (createdAt >= startOfWeek) {
      const dayIndex = Math.floor((createdAt.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < weekLabels.length) {
        weekLabels[dayIndex].value += amount;
      }
    }

    if (createdAt >= startOfMonth) {
      const dayIndex = Math.floor((createdAt.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 31) {
        const bucket = monthBuckets.find((item) => dayIndex >= item.start && dayIndex < item.end);
        if (bucket) bucket.value += amount;
      }
    }

    if (createdAt.getFullYear() === now.getFullYear()) {
      const quarter = Math.floor(createdAt.getMonth() / 3);
      if (yearBuckets[quarter]) {
        yearBuckets[quarter].value += amount;
      }
    }
  });

  return {
    today: todayBuckets.map(({ label, value }) => ({ label, value: Math.round(value) })),
    week: weekLabels.map(({ label, value }) => ({ label, value: Math.round(value) })),
    month: monthBuckets.map(({ label, value }) => ({ label, value: Math.round(value) })),
    year: yearBuckets.map(({ label, value }) => ({ label, value: Math.round(value) })),
  };
};

const mapOrdersCountByPeriod = (orders: Order[] = []): Record<string, number> => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6);

  const startOfMonth = new Date(startOfToday);
  startOfMonth.setDate(startOfToday.getDate() - 30);

  const startOfYear = new Date(startOfToday);
  startOfYear.setMonth(0);
  startOfYear.setDate(1);

  return orders.reduce(
    (acc, order) => {
      const createdAt = new Date(order.createdAt);

      if (createdAt >= startOfToday) {
        acc.today += 1;
      }
      if (createdAt >= startOfWeek) {
        acc.week += 1;
      }
      if (createdAt >= startOfMonth) {
        acc.month += 1;
      }
      if (createdAt >= startOfYear) {
        acc.year += 1;
      }

      return acc;
    },
    { today: 0, week: 0, month: 0, year: 0 },
  );
};

const mapOrdersCountTrendData = (orders: Order[] = []): TrendSeries => {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - 6);

  const startOfMonth = new Date(startOfToday);
  startOfMonth.setDate(startOfToday.getDate() - 30);

  const todayBuckets = [
    { label: '6h', value: 0, start: 0, end: 6 },
    { label: '12h', value: 0, start: 6, end: 12 },
    { label: '18h', value: 0, start: 12, end: 18 },
    { label: '24h', value: 0, start: 18, end: 24 },
  ];

  const weekLabels = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + index);
    return { label: day.toLocaleDateString('en-US', { weekday: 'short' }), value: 0, date: day };
  });

  const monthBuckets = [
    { label: 'Week 1', value: 0, start: 0, end: 7 },
    { label: 'Week 2', value: 0, start: 7, end: 14 },
    { label: 'Week 3', value: 0, start: 14, end: 21 },
    { label: 'Week 4', value: 0, start: 21, end: 31 },
  ];

  const yearBuckets = [
    { label: 'Q1', value: 0, start: 0, end: 3 },
    { label: 'Q2', value: 0, start: 3, end: 6 },
    { label: 'Q3', value: 0, start: 6, end: 9 },
    { label: 'Q4', value: 0, start: 9, end: 12 },
  ];

  orders.forEach((order) => {
    const createdAt = new Date(order.createdAt);

    if (createdAt >= startOfToday) {
      const hour = createdAt.getUTCHours();
      const bucket = todayBuckets.find((item) => hour >= item.start && hour < item.end);
      if (bucket) bucket.value += 1;
    }

    if (createdAt >= startOfWeek) {
      const dayIndex = Math.floor((createdAt.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < weekLabels.length) {
        weekLabels[dayIndex].value += 1;
      }
    }

    if (createdAt >= startOfMonth) {
      const dayIndex = Math.floor((createdAt.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 31) {
        const bucket = monthBuckets.find((item) => dayIndex >= item.start && dayIndex < item.end);
        if (bucket) bucket.value += 1;
      }
    }

    if (createdAt.getFullYear() === now.getFullYear()) {
      const quarter = Math.floor(createdAt.getMonth() / 3);
      if (yearBuckets[quarter]) {
        yearBuckets[quarter].value += 1;
      }
    }
  });

  return {
    today: todayBuckets.map(({ label, value }) => ({ label, value })),
    week: weekLabels.map(({ label, value }) => ({ label, value })),
    month: monthBuckets.map(({ label, value }) => ({ label, value })),
    year: yearBuckets.map(({ label, value }) => ({ label, value })),
  };
};

const mapCategoryPortfolio = (products: Product[] = []): ChartDatum[] => {
  const categoryMap = products.reduce<Record<string, number>>((acc, product) => {
    const value = product.price * product.inventory;
    acc[product.category] = (acc[product.category] || 0) + value;
    return acc;
  }, {});

  return Object.entries(categoryMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, value]) => ({ label, value: Math.round(value) }));
};

const mapTopProducts = (products: Product[] = [], orders: Order[] = []): ChartDatum[] => {
  // Derive top products by quantity sold from orders. If no order data, fall back to inventory counts.
  const agg = {} as Record<string, { label: string; qty: number }>;

  orders.forEach((order) => {
    const key = order.productId ?? order.productTitle ?? 'Unknown';
    const title = order.productTitle || `Product ${order.productId || 'N/A'}`;
    const qty = Number(order.quantity) || 1;

    if (!agg[key]) agg[key] = { label: title, qty: 0 };
    agg[key].qty += qty;
  });

  const fromOrders = Object.values(agg)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
    .map((p) => ({ label: p.label, value: p.qty }));

  if (fromOrders.length) return fromOrders;

  // Fallback: use inventory counts for ranking
  return products
    .slice()
    .sort((a, b) => b.inventory - a.inventory)
    .slice(0, 5)
    .map((product) => ({
      label: product.title,
      value: product.inventory,
    }));
};

const buildDashboardMetrics = (products: Product[] = [], orders: Order[] = []): DashboardMetricSummary => {
  const activeProducts = products.filter((product) => product.status === 'active');
  const totalPortfolioValue = activeProducts.reduce(
    (sum, product) => sum + product.price * product.inventory,
    0,
  );

  const totalInventoryUnits = activeProducts.reduce((sum, product) => sum + product.inventory, 0);
  const averageInventory = activeProducts.length ? Math.round(totalInventoryUnits / activeProducts.length) : 0;
  const lowStockActiveCount = activeProducts.filter((product) => product.inventory <= 50).length;
  const outOfStockVariations = activeProducts
    .filter((product) => product.inventory === 0)
    .reduce((count, product) => count + (product.variations?.length || 0), 0);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length ? totalRevenue / orders.length : 0;
  const orderCompletionRate = orders.length
    ? Math.round((orders.filter((order) => /delivered|completed/i.test(order.status)).length / orders.length) * 100)
    : 0;

  return {
    totalPortfolioValue,
    totalInventoryUnits,
    averageInventory,
    lowStockActiveCount,
    outOfStockVariations,
    activeProductCount: activeProducts.length,
    totalRevenue,
    averageOrderValue,
    orderCompletionRate,
    totalOrderCount: orders.length,
  };
};

export default function useDashboardAnalytics(products: Product[] = [], orders: Order[] = []): DashboardAnalyticsResult {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedSearchTerm = useMemo(() => normalizeText(searchTerm), [searchTerm]);

  const productIndex = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        inventoryValue: Math.round(product.price * product.inventory),
        searchText: buildSearchText(product),
      })),
    [products],
  );

  const filteredProducts = useMemo(() => {
    if (!normalizedSearchTerm) {
      return productIndex
        .slice()
        .sort((a, b) => b.inventoryValue - a.inventoryValue)
        .slice(0, 8);
    }

    return productIndex
      .filter((product) => product.searchText.includes(normalizedSearchTerm))
      .slice(0, 8);
  }, [normalizedSearchTerm, productIndex]);

  const metrics = useMemo(() => buildDashboardMetrics(products, orders), [products, orders]);

  const revenueData = useMemo(() => mapOrdersByQuarter(orders), [orders]);
  const revenueTrendData = useMemo(() => mapRevenueTrendData(orders), [orders]);
  const ordersStatusData = useMemo(() => mapOrderStatusData(orders), [orders]);
  const categorySalesData = useMemo(() => mapCategoryPortfolio(products), [products]);
  const topProductsData = useMemo(() => mapTopProducts(products, orders), [products, orders]);
  const lowStockProducts = useMemo(
    () => products.filter((product) => product.inventory <= 50),
    [products],
  );
  const recentProducts = useMemo(
    () => filteredProducts.map(({ inventoryValue, searchText, ...product }) => product),
    [filteredProducts],
  );
  const revenueByPeriod = useMemo(() => mapRevenueByPeriod(orders), [orders]);
  const ordersCountByPeriod = useMemo(() => mapOrdersCountByPeriod(orders), [orders]);
  const ordersCountTrendData = useMemo(() => mapOrdersCountTrendData(orders), [orders]);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const clearSearch = useCallback(() => setSearchTerm(''), []);

  const searchSummary = useMemo(() => {
    if (!normalizedSearchTerm) {
      return `${products.length} products indexed — showing top catalog value SKUs`;
    }

    return `${filteredProducts.length} match${filteredProducts.length === 1 ? '' : 'es'} found`;
  }, [normalizedSearchTerm, filteredProducts.length, products.length]);

  return {
    searchTerm,
    handleSearchChange,
    clearSearch,
    filteredProducts: recentProducts,
    lowStockProducts,
    metrics,
    searchSummary,
    revenueData,
    revenueTrendData,
    ordersStatusData,
    categorySalesData,
    topProductsData,
    revenueByPeriod,
    ordersCountByPeriod,
    ordersCountTrendData,
  };
}
