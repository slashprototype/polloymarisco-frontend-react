export const getTopProductsByType = (tickets) => {
  const productSalesMap = {};

  console.debug('==> Filtering topProductsByType', tickets);
  tickets.forEach(ticket => {
    ticket.sales_details.forEach(sale => {
      const { product, quantity } = sale;
      const qty = parseFloat(quantity);
      const type = product.product_type;
      const id = product.id;
      const name = product.name;

      if (!productSalesMap[type]) {
        productSalesMap[type] = {};
      }

      if (!productSalesMap[type][id]) {
        productSalesMap[type][id] = {
          id,
          name,
          quantity: 0,
        };
      }

      productSalesMap[type][id].quantity += qty;
    });
  });

  const result = {};

  Object.keys(productSalesMap).forEach(type => {
    const products = Object.values(productSalesMap[type]);
    result[type] = {
      topMostSold: [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 15),
      topLeastSold: [...products].sort((a, b) => a.quantity - b.quantity).slice(0, 15),
    };
  });

  return result;
}
