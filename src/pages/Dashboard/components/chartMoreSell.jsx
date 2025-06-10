import React, { useEffect, useState, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { getProductById } from "../../../services/productService";
import { getTopProductsByType } from "../../../utils/topProductsByType";
import TopProductsChart from "./topProductsChart";

import "./chartMoreSell.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Lo más vendido",
      font: {
        size: 20,
        weight: "bold",
      },
    },
  },
};

const ChartMoreSell = (props) => {
  console.debug("Props received [chartMoreSell]: ", props);
  const topProducts = props.sales
    ? props.sales.details
        .map((p) => ({
          product_id: p.product_id,
          total_quantity: parseFloat(p.total_quantity),
        }))
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 5)
    : [];

  const sellersData = props.sellers.map((seller) => {
    return { id: seller.id, name: seller.first_name };
  });
  const resultProducts = getTopProductsByType(props.salesTickets);
  const [sales, setSales] = useState();
  const [productsSells, setProductsSells] = useState([]);
  const productsName = [];
  const [products, setProducts] = useState([]);
  const hasFetched = useRef(false); // ← Referencia persistente
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedStartMonth, setSelectedStartMonth] = useState(0); // January
  const [selectedEndMonth, setSelectedEndMonth] = useState(11); // December

  useEffect(() => {
    if (!hasFetched.current && topProducts.length > 0) {
      hasFetched.current = true;
      setLoadingProducts(true);
      const fetchProducts = async () => {
        try {
          // Generate an array of promises to fetch product data by ID
          const productPromises = topProducts.map((p) => {
            return getProductById(p.product_id); // Return promise from service
          });
          // Wait until all product fetch requests are completed
          const fetchedProducts = await Promise.all(productPromises);

          // Combine fetched product details with their corresponding total_quantity from topProducts
          const combined = fetchedProducts.map((product) => {
            // Find the matching product by ID in the topProducts array
            const match = topProducts.find((p) => p.product_id === product.id);
            return {
              ...product, // Spread the original product details
              total_quantity: match?.total_quantity || 0, // Add the quantity sold or default to 0
            };
          });
          // Update state with the combined product data
          setProducts(combined);
        } catch (error) {
          // Handle any error that occurs during fetching
          console.error("Error fetching products:", error);
        } finally {
          // Regardless of success or failure, stop the loading state
          setLoadingProducts(false);
        }
      };
      fetchProducts();
    }
  }, [topProducts]);

  let sellersMap = {};
  props.salesTickets.forEach(({ seller, service_quality }) => {
    if (!sellersMap[seller]) {
      sellersMap[seller] = { good: 0, bad: 0, regular: 0 };
    }
    if (service_quality === "GOOD") {
      sellersMap[seller].good += 1;
      sellersMap[seller].name = sellersData.find((s) => s.id === seller).name;
    }
    if (service_quality === "BAD") {
      sellersMap[seller].bad += 1;
      sellersMap[seller].name = sellersData.find((s) => s.id === seller).name;
    }
    if (service_quality === "REGULAR") {
      sellersMap[seller].regular += 1;
      sellersMap[seller].name = sellersData.find((s) => s.id === seller).name;
    }
  });

  const dataTopProducts = {
    labels: products.map((p) => `${p.name}`),
    datasets: [
      {
        label: "Cantidad total vendida",
        backgroundColor: "rgb(0, 177, 56)",
        borderWidth: 1,
        data: products.map((p) => p.total_quantity),
      },
    ],
  };
  //console.debug('Result products [chartMoreSell]: ', resultProducts);
  //console.debug("Sellers map [chartMoreSell]: ", sellersMap);

  // * Receive data from parent to plot and sync with Date picker
  const handleEndMonthChange = (e) => {
    const newEnd = parseInt(e.target.value);
    setSelectedEndMonth(newEnd);
    if (newEnd < selectedStartMonth) {
      setSelectedStartMonth(newEnd);
    }
  };
  const weeklySalesChart = () => {
    const chartData = {
      labels: props.weeklySales.map((item) => item.weekLabel), // Ej: Semana 1, Semana 2...
      datasets: [
        {
          label: "Venta Total (MXN)",
          data: props.weeklySales.map((item) => item.total_amount),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
/*         {
          label: "Total de Productos",
          data: props.weeklySales.map((item) => item.total_items),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        }, */
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 100,
          },
        },
      },
    };

    return (
      <div style={{ width: "120%", height: "300px", margin: "4px",  minWidth: "300px", }}>
        <h4 style={{ textAlign: "center" }}>Ventas Semanales (últimas 7 semanas)</h4>
        <Bar data={chartData} options={options} />
      </div>
    );
  }
  // Convertir el map a un array de gráficos
  const sellerCharts = Object.entries(sellersMap).map(([sellerId, counts]) => {
    const chartData = {
      labels: ["Bueno", "Malo", "Regular"],
      datasets: [
        {
          data: [counts.good, counts.bad, counts.regular],
          backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
          hoverOffset: 4,
        },
      ],
    };
    return (
      <div key={sellerId} style={{ width: "200px", margin: "2px" }}>
        <h4>Vendedor {counts.name}</h4>
        <Pie data={chartData} />
      </div>
    );
  });



  return (
    <div className="chart-container">
      <div style={{ width: "500px", height: "290px" }}>
        <Bar data={dataTopProducts} options={options} />
      </div>
      <div
        className="chart-sellers"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {sellerCharts}{" "}
      </div>
      { weeklySalesChart()}
      <TopProductsChart
        title="Top productos más y menos vendidos (Kg)"
        mostSold={resultProducts.weight_based.topMostSold}
        leastSold={resultProducts.weight_based.topLeastSold}
      
      />
      <TopProductsChart
        title="Top productos más y menos vendidos (Piezas)"
        mostSold={resultProducts.packaged.topMostSold}
        leastSold={resultProducts.packaged.topLeastSold}
      />
    </div>
  );
};

export default ChartMoreSell;
