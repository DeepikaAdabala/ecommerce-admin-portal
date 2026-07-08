import { initialOrders } from './src/data/mockOrders.js';
import { initialCustomers } from './src/data/mockCustomers.js';

const totals = initialOrders.reduce((acc, order) => {
  acc[order.customerName] = (acc[order.customerName] || 0) + Number(order.total || 0);
  return acc;
}, {});

const customers = initialCustomers.map((customer) => ({
  name: customer.name,
  existingLifetime: customer.lifetimeValue,
  calculatedLifetime: Number((totals[customer.name] || 0).toFixed(2)),
  tier: customer.tier,
}));

console.log(JSON.stringify(customers, null, 2));
console.log(JSON.stringify(totals, null, 2));
