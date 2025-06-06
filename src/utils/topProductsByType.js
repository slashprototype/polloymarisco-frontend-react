export const getTopProductsByType = (tickets) => {
  const productSalesMap = {};

  // Paso 1: Mapear productos vendidos por tipo
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

  const allProductTypes = ['weight_based', 'packaged']; // Agrega otros tipos si es necesario
  const defaultEntry = [{ name: "Sin datos", quantity: 0 }];

  // Paso 2: Construir topMost y topLeast con fallback por tipo
  allProductTypes.forEach(type => {
    const products = productSalesMap[type]
      ? Object.values(productSalesMap[type])
      : [];

    result[type] = {
      topMostSold: products.length
        ? [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 15)
        : defaultEntry,
      topLeastSold: products.length
        ? [...products].sort((a, b) => a.quantity - b.quantity).slice(0, 15)
        : defaultEntry,
    };
  });

  return result;
};
