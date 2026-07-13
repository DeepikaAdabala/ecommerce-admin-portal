export type ProductStatus = 'active' | 'draft' | 'archived';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded' | 'Unknown';
export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded' | 'Failed' | 'Unknown';
export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Product {
  id: string;
  title: string;
  sku: string;
  category: string;
  price: number;
  inventory: number;
  variations: string[];
  description: string;
  status: ProductStatus;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  productId?: string;
  productTitle?: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  productCategory?: string;
  customerTier?: CustomerTier;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  tier: CustomerTier;
  lastOrder: string;
  lifetimeValue: number;
  status: 'active' | 'inactive';
}

export interface Variant {
  id: string;
  name: string;
  sku: string;
  priceDelta: number;
}

export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  leadTimeDays: number;
  active: boolean;
}

export interface DashboardMetricSummary {
  totalPortfolioValue: number;
  totalInventoryUnits: number;
  averageInventory: number;
  lowStockActiveCount: number;
  outOfStockVariations: number;
  activeProductCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  orderCompletionRate: number;
  totalOrderCount: number;
}

export interface ChartDatum {
  label: string;
  value: number;
}

export interface TrendSeries {
  today: ChartDatum[];
  week: ChartDatum[];
  month: ChartDatum[];
  year: ChartDatum[];
}

export interface DashboardAnalyticsResult {
  searchTerm: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  filteredProducts: Product[];
  lowStockProducts: Product[];
  metrics: DashboardMetricSummary;
  searchSummary: string;
  revenueData: ChartDatum[];
  revenueTrendData: TrendSeries;
  ordersStatusData: ChartDatum[];
  categorySalesData: ChartDatum[];
  topProductsData: ChartDatum[];
  revenueByPeriod: Record<string, number>;
  ordersCountByPeriod: Record<string, number>;
  ordersCountTrendData: TrendSeries;
}
