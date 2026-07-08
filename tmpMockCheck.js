const { initialOrders } = require('./src/data/mockOrders.js');
const { initialCustomers } = require('./src/data/mockCustomers.js');
const { initialProducts } = require('./src/data/mockProducts.js');
const custNames = new Set(initialCustomers.map(c => c.name));
const prodMap = new Map(initialProducts.map(p => [p.id, p]));
const invalidCustomers = [];
const invalidProducts = [];
const invalidTotals = [];
initialOrders.forEach(o => {
  if (!custNames.has(o.customerName)) invalidCustomers.push(o.id + ' ' + o.customerName);
  if (!prodMap.has(o.productId)) invalidProducts.push(o.id + ' ' + o.productId);
  const product = prodMap.get(o.productId);
  if (product) {
    const expected = Number((product.price * o.quantity).toFixed(2));
    if (typeof o.total !== 'number' || Number(o.total.toFixed(2)) !== expected) {
      invalidTotals.push({ id: o.id, got: o.total, exp: expected });
    }
  }
});
console.log(JSON.stringify({ invalidCustomers, invalidProducts, invalidTotals }, null, 2));
