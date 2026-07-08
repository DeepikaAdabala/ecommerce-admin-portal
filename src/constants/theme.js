export const API_TIMEOUT_MS = 10000;
export const LAYOUT_GAP = '1rem';
export const VALIDATION_PATTERNS = {
  sku: /^[A-Z0-9_-]{4,16}$/, 
  price: /^(?!-)(?:\d+|\d+\.\d{1,2})$/,
  inventory: /^[0-9]+$/,
};
export const PRODUCT_CATEGORIES = ['Apparel', 'Electronics', 'Accessories', 'Home', 'Office', 'Fitness'];
export const TEXT = {
  appTitle: 'Admin Portal',
  description: 'Centralized product publishing and catalog operations.',
};
