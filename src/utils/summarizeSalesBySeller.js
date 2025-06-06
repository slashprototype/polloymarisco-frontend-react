/**
 * Aggregates sales data per seller from raw salesTickets and includes seller name.
 *
 * @param {Array} salesTickets - Array of sales ticket objects per seller
 * @param {Array} sellersData - Array of seller info: { id, name }
 * @returns {Array} - Aggregated metrics per seller with names
 */
export const summarizeSalesBySeller = (salesTickets, sellersData) => {
  const sellerSummaryMap = {};

  // Create a map of sellerId → name for quick lookup
  const sellerNameMap = sellersData.reduce((map, seller) => {
    map[seller.id] = seller.name;
    return map;
  }, {});

  salesTickets.forEach(ticket => {
    const sellerId = ticket.seller;

    if (!sellerSummaryMap[sellerId]) {
      sellerSummaryMap[sellerId] = {
        sellerId,
        sellerName: sellerNameMap[sellerId] || "Unknown",
        totalAmount: 0,
        totalKilos: 0,
        totalUnits: 0,
      };
    }

    // Sum total amount
    sellerSummaryMap[sellerId].totalAmount += ticket.total_amount || 0;

    // Process each sale
    ticket.sales_details.forEach(sale => {
      const quantity = parseFloat(sale.quantity) || 0;
      const type = sale.product.product_type;

      if (type === "weight_based") {
        sellerSummaryMap[sellerId].totalKilos += quantity;
      } else if (type === "packaged") {
        sellerSummaryMap[sellerId].totalUnits += quantity;
      }
    });
  });

  return Object.values(sellerSummaryMap);
};
